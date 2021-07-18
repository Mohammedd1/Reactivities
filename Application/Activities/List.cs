using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>>
        {

        }
        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.ToListAsync();
            }

            //**********************************************
            //Cancellation token Demonstration:
            // private readonly DataContext _context;
            // private readonly ILogger<List> _logger;
            // public Handler(DataContext context, ILogger<List> logger)//ILogger<List>--> we pass the class we are in into Ilogger
            // {
            //     _context = context;
            //     _logger = logger;
            // }

            // public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            // {
            //     try
            //     {
            //         for (int i = 0; i < 10; i++)
            //         {
            //             cancellationToken.ThrowIfCancellationRequested();
            //             await Task.Delay(100, cancellationToken);
            //             //using the logger to see what happened in the terminal console 
            //             _logger.LogInformation($"Task {i} has completed");
            //         }

            //     }
            //     catch (Exception ex)
            //     {
            //         _logger.LogInformation("Task was canceled");
            //     }
            //     return await _context.Activities.ToListAsync(cancellationToken);// pass the cancellation token we got from the handler to the entity framework query
            // }
        }
    }
}