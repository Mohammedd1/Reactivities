//273
using System;

namespace Domain
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public AppUser AppUser { get; set; }
        public string  Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked==null && !IsExpired;

    }
}