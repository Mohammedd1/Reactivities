using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //Command: do not returns anything
        public class Command : IRequest
        {

            //passing object of the Activity to this handler when we created
            public Activity Activity { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //Unit is just an object that mediator provide, but it doesn't have any actual value
                _context.Activities.Add(request.Activity);
                await _context.SaveChangesAsync();

                return Unit.Value;//equivalent to return nothing
            }
        }
    }
}