using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        // public class Query : IRequest<Result<List<Activity>>>
        public class Query : IRequest<Result<List<ActivityDto>>>
        {

        }
        // public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                //return Result<List<Activity>>.Success(await _context.Activities.ToListAsync(cancellationToken));

                /***************/
                //Eager Loading:
                // var activities = await _context.Activities
                // .Include(a => a.Attendees)
                // .ThenInclude(u => u.AppUser)
                // .ToListAsync(cancellationToken);

                // //After changing from Activity to ActivityDto,we had implicit conversion error for the below,
                // //return Result<List<Activity>>.Success(activities);
                // //so we need to use auto mapper 
                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);
                // return Result<List<ActivityDto>>.Success(activitiesToReturn);
                /***************/
                //Projection
                //Instead of returning all properties that we don't need we can use
                // ProjectTo(like using Select in Linq, but in mapper is more easy)
                var activities = await _context.Activities
               .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);

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