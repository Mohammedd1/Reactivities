using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
        {
            //becuase we are extending the IServiceCollection we need to use this in the parameters
            //some of the services need configuration,so we need to pass IConfiguration to this method
            services.AddSwaggerGen(c =>
         {
             c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
         });
            //Inject Dbcontext class dependency
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                 {
                     policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                 });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);//tells the mediator where our handler is

            //Adding automapper service
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            //we've now got the ability to get the currently logged in users username from
            //anywhere in our application, really.
            services.AddScoped<IUserAccessor, UserAccessor>();

            return services;
        }
    }
}