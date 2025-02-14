using System;
using System.Collections.Generic;

public abstract class Device: IKontrola{
    public string Naziv {get; set;}
    public bool statusUredjaja{get;set;}

    public Device(String naziv){
        Naziv=naziv;
        statusUredjaja=false; //uredjaj nije upaljen
    }

    /*imacemo i metode koje nam ukljucuju i iskljjucuju uredjaje*/

    public abstract void ukljuciUredjaj();
    public abstract void iskljuciUredjaj();

    public virtual void prikaziStatus(){
        Console.WriteLine($"{Naziv} je {(statusUredjaja ? "uključeno" : "isključeno")}");
    }
}