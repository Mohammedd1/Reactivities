using Domain;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using Application.Core;

namespace API.Controllers
{

    public class ActivitiesController : BaseApiController
    {
        //Thin contrller:we gonna move the below commnetted code into basecontroller
        // private readonly IMediator _mediator;
        // public ActivitiesController(IMediator mediator)
        // {
        //     _mediator = mediator;
        // }


        [HttpGet]
        //modified 238-244
        public async Task<IActionResult> GetActivities([FromQuery] ActivityParams param)
        {
            // return HandleResult(await Mediator.Send(new List.Query{Params=param}));
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));//modified 239
        }
        //Coancellation token Demonstration
        // [HttpGet]
        // public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        // {
        //     return await Mediator.Send(new List.Query(),ct);
        // }
        //end of cancelllation token
        // [Authorize] //we removed this after adding auth policy to startup class
        [HttpGet("{id}")]
        // public async Task<ActionResult<Activity>> GetActivity(Guid id)
        public async Task<IActionResult> GetActivity(Guid id)
        {
            //return await Mediator.Send(new Details.Query{Id=id});//object initializer achived by {} :Details.Query{Id=id}-->means set id when inislaize :Details.Query
            ////return 404 instead of 204 no content
            // var activity = await Mediator.Send(new Details.Query { Id = id });

            // if (activity == null) return NotFound();

            // return activity;

            // var result = await Mediator.Send(new Details.Query { Id = id });

            // if (result.IsSuccess && result.Value != null)
            //     return Ok(result.Value);
            // if (result.IsSuccess && result.Value == null)
            //     return NotFound();
            // return BadRequest(result.Error);

            //// now we will move the upper code to the base controller,because we will ise it in each controller action and 
            ////to make the actions pretty small
            ////so here you see that any shared code should be on one place is better.

            ////after adding the handle result method in base controller
            //var result = await Mediator.Send(new Details.Query { Id = id });
            //return HandleResult(result);

            //// also we can use single line like below
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            //IActionResult:gives us access to http respones.
            //return Ok(await Mediator.Send(new Create.Command { Activity = activity }));
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }
        [Authorize(Policy = "IsActivityHost")]//the policy we created in IdentityServiceExtensions
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            //IActionResult:gives us access to http respones.
            activity.Id = id;
            //return Ok(await Mediator.Send(new Edit.Command { Activity = activity }));
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]//the policy we created in IdentityServiceExtensions
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            //IActionResult:gives us access to http respones.

            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));

        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}