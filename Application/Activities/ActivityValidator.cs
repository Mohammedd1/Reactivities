using Domain;
using FluentValidation;

namespace Application.Activities
{
    //instead on validate the activity on each class like create ,edit, we are creating this class to validate activities 
    //everwhere we want
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.City).NotEmpty();
            RuleFor(x => x.Venue).NotEmpty();

        }
    }
}