using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        // public class Query:IRequest<Activity>{
        public class Query : IRequest<Result<Activity>>
        {

            public Guid Id { get; set; }
        }

        // public class Handler:IRequestHandler<Query,Activity>{
        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            //public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                //return await _context.Activities.FindAsync(request.Id);
                var activity = await _context.Activities.FindAsync(request.Id);
                return Result<Activity>.Success(activity);
            }
        }
    }
}