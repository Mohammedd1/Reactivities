using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(AppUser user)
        {
            //claims about the user
            var claims = new List<Claim>
            {
               new Claim(ClaimTypes.Name,user.UserName),
               new Claim(ClaimTypes.NameIdentifier,user.Id),
               new Claim(ClaimTypes.Email,user.Email)
            };

            //Sign our token with encrypted key
            // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);//HmacSha512Signature the strongest one available

            //Describe token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHnadler = new JwtSecurityTokenHandler();

            var token = tokenHnadler.CreateToken(tokenDescriptor);

            return tokenHnadler.WriteToken(token);

        }
    }
}