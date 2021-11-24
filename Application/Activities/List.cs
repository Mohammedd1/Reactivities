using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        // public class Query : IRequest<Result<List<Activity>>>
        // public class Query : IRequest<Result<List<ActivityDto>>>
        public class Query : IRequest<Result<PagedList<ActivityDto>>> //modified 238
        {
            public ActivityParams Params { get; set; }//modified 244

        }
        // public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        // public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>> //modified 238
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)//modified228
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
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
                //modified 238
                //     var activities = await _context.Activities
                //    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                //    new {currentUsername=_userAccessor.GetUsername()})//modified 228
                //     .ToListAsync(cancellationToken);

                var query = _context.Activities
                .Where(d => d.Date >= request.Params.StartDate)//244
                .OrderBy(d => d.Date)//modified 239
                   .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                   new { currentUsername = _userAccessor.GetUsername() })//modified 228
                    .AsQueryable();

                //244
                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                }
                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                }

                //return Result<List<ActivityDto>>.Success(activities);
                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                ); //modified 238


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