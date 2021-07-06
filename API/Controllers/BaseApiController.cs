using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    //[Route("[controller]")] // /controllername
      [Route("api/[controller]")] // api/controllername
    public class BaseApiController:ControllerBase 
    {
        
    }
}