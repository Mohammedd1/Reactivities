using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace API.Controllers
{
    //[AllowAnonymous]//all endpoints in this controller the use will be able to access anonymously
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly EmailSender _emailSender;

        public AccountController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager, TokenService tokenService,
         IConfiguration config, EmailSender emailSender)//modified 268 - 283
        {
            _emailSender = emailSender;
            _config = config;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
            //268
            _httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
        }
        [AllowAnonymous]//274
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //var user = await _userManager.FindByEmailAsync(loginDto.Email);
            //189
            var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);


            if (user == null) return Unauthorized("Invalid email");//modified 282

            if (!user.EmailConfirmed) return Unauthorized("Email not confirmed");//282

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {

                await SetRefreshToken(user);//274

                return CreateUserObject(user);
            }

            //if not succeeded
            return Unauthorized("Invalid password"); //modified 282

        }
        [AllowAnonymous]//274
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                //return BadRequest("Email taken");
                return ValidationProblem();
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                // return BadRequest("Username taken");
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();

            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest("Problem registering user"); //modified 283

            //283
            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            var message = $"<p>Please click the below link to verify you emial address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";
            await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

            return Ok("Registration success - please verify email");

        }
        //284
        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<IActionResult> VerifyEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized();
            var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded) return BadRequest("Could not verify email address");

            return Ok("Email confirmed - you can now login");

        }
        //284
        [AllowAnonymous]
        [HttpPost("resendEmailConfirmationLink")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized();

            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            var message = $"<p>Please click the below link to verify you emial address:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";
            
            await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

            return Ok("Email verification link resent");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            //var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            //189
            var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            //274
            await SetRefreshToken(user);

            return CreateUserObject(user);

        }

        //268
        [AllowAnonymous]//274
        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var fbverifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];

            var verifyToken = await _httpClient
            .GetAsync($"debug_token?input_token={accessToken}&access_token={fbverifyKeys}");

            if (!verifyToken.IsSuccessStatusCode) return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

            var response = await _httpClient.GetAsync(fbUrl);

            if (!response.IsSuccessStatusCode) return Unauthorized();

            //modified 269
            var fbInfo = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

            var username = (string)fbInfo.id;

            var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == username);

            if (user != null) return CreateUserObject(user);

            user = new AppUser
            {
                DisplayName = (string)fbInfo.name,
                Email = (string)fbInfo.email,
                UserName = (string)fbInfo.id,
                Photos = new List<Photo> {
                    new Photo {
                         Id = "fb_" + (string)fbInfo.id,
                          Url = (string)fbInfo.picture.data.url,
                           IsMain = true
                         }}
            };

            user.EmailConfirmed = true;//282
            
            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem creating user account");

            //274
            await SetRefreshToken(user);
            return CreateUserObject(user);

        }

        //274
        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
            .Include(r => r.RefreshTokens)
            .Include(p => p.Photos)//modified 276
            .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);
            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            return CreateUserObject(user);
        }
        //274
        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

        }
        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,//189 -- ?. --> Optional chaining
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }

}