using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Application.Core;
using API.Extensions;

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

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value);
            if (result.IsSuccess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }

        //239
        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize,
                result.Value.TotalCount, result.Value.TotalPages);
                return Ok(result.Value);
            }

            if (result.IsSuccess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        }
    }
}