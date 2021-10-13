using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]//all endpoints in this controller the use will be able to access anonymously
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            //var user = await _userManager.FindByEmailAsync(loginDto.Email);
            //189
            var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);


            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                // return new UserDto
                // {
                //     DisplayName = user.DisplayName,
                //     Image = null,
                //     Token = _tokenService.CreateToken(user),
                //     Username = user.UserName
                // };
                return CreateUserObject(user);
            }

            //if not succeeded
            return Unauthorized();

        }

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

            if (result.Succeeded)
            {
                // return new UserDto
                // {
                //     DisplayName = user.DisplayName,
                //     Image = null,
                //     Token = _tokenService.CreateToken(user),
                //     Username = user.UserName
                // };
                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user");
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            //var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            //189
            var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);

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