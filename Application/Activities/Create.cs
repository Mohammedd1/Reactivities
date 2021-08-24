using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //Command: do not returns anything
        //after adding Result it is perfectly fine to return whether or not the requests has been successful or
        //it's been a failure.

        //public class Command : IRequest
        public class Command : IRequest<Result<Unit>>//Unit: we are not really returning anything from here,we will handle it in our 
        {
            //passing object of the Activity to this handler when we created
            public Activity Activity { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        //instead of validating against the activity, now we're going to specify that we want to validate
        //against the command because the command class contains our activity.
        {
            public CommandValidator()
            {
                //Specifiy what rules we want to add.
                // RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());

            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }


            // public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                /*
                  the goal of this, of course, is that when a user
                  creates a new activity, they're going to be added as an attendee of the activity and marked as the
                 host of the activity when they create it.
                 */
                var user = await _context.Users.FirstOrDefaultAsync(x =>

                  x.UserName == _userAccessor.GetUsername());

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                request.Activity.Attendees.Add(attendee);

                /*the below code will remain as it is after adding the above*/

                //Unit is just an object that mediator provide, but it doesn't have any actual value
                _context.Activities.Add(request.Activity);
                //await _context.SaveChangesAsync();
                //return Unit.Value;//equivalent to return nothing

                //SaveChangesAsync: return a number (the number of state entries written to the database)
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}