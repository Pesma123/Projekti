using System.Reflection;

public class Temperature: Device{
    public int currentTemp {get ; private set;}
    public int idealTemp{get ; private set;}
    public string mode{get; private set;}

    public Temperature (string Naziv) : base(Naziv){
        currentTemp=0;
        idealTemp=0;
        mode="OFF";
    }
        // Metoda za postavljanje ciljne temperature
    public void setIdealTemp(int newTemp)
    {
        idealTemp = newTemp;
        Console.WriteLine($"Ciljana temperatura na '{Naziv}' postavljena na {idealTemp}°C.");
    }

    // Metoda za promjenu režima rada
    public void setMode(string newMode)
    {
        if (newMode != "Grijanje" && newMode != "Hlađenje" && newMode != "Isključeno")
        {
            Console.WriteLine("Greška: Režim rada mora biti 'Grijanje', 'Hlađenje' ili 'Isključeno'.");
            return;
        }

        mode = newMode;
        Console.WriteLine($"Režim rada na '{Naziv}' postavljen na {mode}.");
    }

    // Simulacija promjene trenutne temperature
    public void setCurrentTemp(int newTemp)
    {
        currentTemp = newTemp;
        Console.WriteLine($"Trenutna temperatura na '{Naziv}' je sada {currentTemp}°C.");
    }
    public override void ukljuciUredjaj()
    {
        setCurrentTemp(25);
        setIdealTemp(25);
        setMode("Grijanje");
        statusUredjaja=true;
    }
    public override void iskljuciUredjaj()
    {
        setCurrentTemp(0);
        setIdealTemp(0);
        setMode("Iskljuceno");
        statusUredjaja=false;
    }

    // Prikaz trenutnog stanja termostata
    public void StatusT()
    {
        Console.WriteLine($"Temp '{Naziv}' je {(statusUredjaja? "ukljuceno" : "iskljuceno")},current temperature is {currentTemp}, ideal temp would be {idealTemp} and the mode is set to {mode}.");
        
    }
}

