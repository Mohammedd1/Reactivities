using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    //[Route("[controller]")] // /controllername
    [Route("api/[controller]")] // api/controllername
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        //??= :null-coalescing assignment operator,assigns the value of its right-hand operand
        // to its left-hand operand only if the left-hand operand evaluates to null.
        //The ??= operator doesn't evaluate its right-hand operand if the left-hand operand evaluates to non-null.
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
    }
}