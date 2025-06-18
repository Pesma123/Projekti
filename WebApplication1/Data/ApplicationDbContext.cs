using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : IdentityDbContext<Korisnik>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext>
       options)
        : base(options)
        {
        }
        
        public DbSet<Notifikacija> Notifikacija { get; set; }
        public DbSet<Predmet> Predmet { get; set; }
        public DbSet<Ispit> Ispit { get; set; }
        public DbSet<Izvjestaj> Izvjestaj { get; set; }
        public DbSet<KorisnikPredmet> KorisnikPredmet { get; set; }
        public DbSet<NotifikacijaKorisnik> NotifikacijaKorisnik { get; set; }
        public DbSet<Profesor> Profesori { get; set; }
        public DbSet<RegistracijaIspita> RegistracijeIspita { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Korisnik>(b =>
            {
                b.Property(u => u.Ime);
                b.Property(u => u.Prezime);
                b.Property(u => u.Email);
                b.Property(u => u.uloga);
            });
            modelBuilder.Entity<Notifikacija>().ToTable("Notifikacija");
            modelBuilder.Entity<Predmet>().ToTable("Predmet");
            modelBuilder.Entity<Ispit>().ToTable("Ispit");
            modelBuilder.Entity<Izvjestaj>().ToTable("Izvjestaj");
            modelBuilder.Entity<Profesor>().ToTable("Profesori");
            modelBuilder.Entity<KorisnikPredmet>()
    .HasOne(kp => kp.Korisnik)
    .WithMany(k => k.KorisnikPredmet)
    .HasForeignKey(kp => kp.KorisnikId);

            modelBuilder.Entity<KorisnikPredmet>()
                .HasOne(kp => kp.Predmet)
                .WithMany(p => p.KorisnikPredmet)
                .HasForeignKey(kp => kp.PredmetID);


            base.OnModelCreating(modelBuilder);
        }
    }
}
