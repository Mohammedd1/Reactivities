using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using Application.Core;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API
{
    public class Startup
    {
        // public Startup(IConfiguration configuration)
        // {
        //     Configuration = configuration;
        // }

        // public IConfiguration Configuration { get; }
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddControllers();
            //specifiy the fluent validation
            services.AddControllers(opt =>
            {
                //authorization policy
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));

            })
            .AddFluentValidation(config =>
            {
                //we don't need to repeat this for each class create,delete,details,... , RegisterValidatorsFromAssemblyContaining
                //will bring all the classess on same assepmly that Create is located in. 
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });

            //Extensions
            services.AddApplicationServices(_config);
            services.AddIdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //anything in Configure method is a meddleware

            app.UseMiddleware<ExceptionMiddleware>();

            //261
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(opt => opt.Deny());
            // app.UseCspReportOnly(opt => opt
            app.UseCsp(opt => opt //modified 262
           .BlockAllMixedContent()
           .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))//modified 262 -allowing fonts from outside our application 
           .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))//modified 262
           .FormActions(s => s.Self())
           .FrameAncestors(s => s.Self())
           .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com"))//modified 262
           .ScriptSources(s => s.Self().CustomSources("sha256-f9+ZQdWdVlJSMIIKOYpzkJBLj5R4gy1aPzDN7MtriBg="))//modified 262 - unsafe inline script
           );

            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            //262
            else
            {
                app.Use(async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");//31536000 represent one year
                    await next.Invoke();
                });
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            //256
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");//add it below app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                //214
                endpoints.MapHub<ChatHub>("/chat");
                //256
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
