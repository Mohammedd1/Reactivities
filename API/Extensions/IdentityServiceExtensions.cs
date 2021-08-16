using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection servcies, IConfiguration config)
        {
            servcies.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            //servcies.AddAuthentication();
            // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key"));
             var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
            
            servcies.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>{
                opt.TokenValidationParameters= new TokenValidationParameters
                {
                    ValidateIssuerSigningKey=true,//we will compare the key in the token with the one in our server
                    IssuerSigningKey= key,//tell the servre about the key it needs to use
                    ValidateIssuer=false,
                    ValidateAudience=false
                };
            });

            servcies.AddScoped<TokenService>();
            return servcies;
        }
    }
}