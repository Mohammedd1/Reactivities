//238
namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 2;
        public int PageSize
        {
            get => _pageSize;//this is the shorten of (same as)--> get{return _pageSize};
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;//set{_pageSize=value;}
        }
    }
}