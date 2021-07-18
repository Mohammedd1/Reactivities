using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            // public Handler(DataContext context)
            // {
            //     _context = context;
            // }
            //after Adding Automapper
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                //we are only updating the Title.`
                //activity.Title = request.Activity.Title ?? activity.Title;//if request.Activity.Title == null keep the old value.
                //i comment the above line after adding automapper, and now instead of mapping each property like above,we will do the follwoing:
                _mapper.Map(request.Activity,activity);//this will map all properties in the request.Activity with the activity.

                await _context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}