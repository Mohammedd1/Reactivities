using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Application.Profiles;

namespace API.Controllers
{
    //187
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }
        //207
        [HttpPut]
public async Task<IActionResult> Edit(Edit.Command command)
{
return HandleResult(await Mediator.Send(command));
}
    }
}