using Domain;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Activities;
using System.Threading;

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
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }
        //Coancellation token Demonstration
        // [HttpGet]
        // public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        // {
        //     return await Mediator.Send(new List.Query(),ct);
        // }
        //end of cancelllation token
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id=id});//object initializer achived by {} :Details.Query{Id=id}-->means set id when inislaize :Details.Query
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            //IActionResult:gives us access to http respones.
            return Ok(await Mediator.Send(new Create.Command {Activity=activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity){
            //IActionResult:gives us access to http respones.
            activity.Id=id; 
            return Ok(await Mediator.Send(new Edit.Command {Activity=activity}));
        }

         [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            //IActionResult:gives us access to http respones.

            return Ok(await Mediator.Send(new Delete.Command {Id=id}));
        }
    }
}