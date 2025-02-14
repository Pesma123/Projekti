public class Light : Device{
    public int intensityOfLight{get ; private set;}
    public string color{get; private set; }

    public Light(String Naziv) : base(Naziv){
        intensityOfLight=0;
        color="White";
    }

    //method that help us select the intensity of light
    public void setIntensity(int newIntensity){
        if(newIntensity<0 || newIntensity>100){
            Console.Write("ERROR: Intensity can be in the range od 0-100.");
            return;
        }
        intensityOfLight=newIntensity;
        Console.WriteLine($"Intensity of light '{Naziv}' has been set to {intensityOfLight}%.");
    }

    //method for changing the collor of light
    public void changeTheColor(string newColor){
      color=newColor;
      Console.WriteLine($"The color of the light has been changed to {color}.");
    }

    public override void ukljuciUredjaj(){
        setIntensity(85);
        changeTheColor("Pink");
        statusUredjaja=true;
    }
    public override void iskljuciUredjaj(){
        setIntensity(0);
        changeTheColor("White");
        statusUredjaja=false;
    }

    //status of Light
    public void status() {
        Console.WriteLine($"Light '{Naziv}' je {(statusUredjaja? "ukljuceno" : "iskljuceno")}, intensity od light is {intensityOfLight}%, with color: {color}.");

    }

}