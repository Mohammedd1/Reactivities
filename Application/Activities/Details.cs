using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        // public class Query:IRequest<Activity>{
        public class Query : IRequest<Result<ActivityDto>>
        {

            public Guid Id { get; set; }
        }

        // public class Handler:IRequestHandler<Query,Activity>{
        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            //public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                //return await _context.Activities.FindAsync(request.Id);
                // var activity = await _context.Activities.FindAsync(request.Id);
                // return Result<Activity>.Success(activity);

                var activity = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}