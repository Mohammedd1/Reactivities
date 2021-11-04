using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

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
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,//we will compare the key in the token with the one in our server
                    IssuerSigningKey = key,//tell the servre about the key it needs to use
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                //214 
                //SingalR Authentication
                //It's different to how we do it in an API controller because in 
                //singalR we don't have the ability to send up an HTTP header.so that we need to put Jwt as a query string.
                opt.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                        {
                            context.Token = accessToken;

                        }
                        return Task.CompletedTask;
                    }
                };
            });

            servcies.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            servcies.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            servcies.AddScoped<TokenService>();
            return servcies;
        }
    }
}