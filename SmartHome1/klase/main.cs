

class main {
    static void Main(string[] args){

       SmartHome home=new SmartHome();

       Room livingRoom=new Room("LivingRoom");
       Room bedroom1=new Room("Bedroom 1");
       Room bedroom2=new Room("Bedroom 2");
       Room bathroom=new Room("Bathroom");
       
       home.dodajSobu(livingRoom);
       home.dodajSobu(bedroom1);
       home.dodajSobu(bedroom2);
       home.dodajSobu(bathroom);
       
       /*dodajemo uredjaje u sobe*/
       livingRoom.addDevice(new Light("Luster"));
       livingRoom.addDevice(new Temperature("Radijator"));
       bedroom1.addDevice(new Light("Lampa"));
       bedroom1.addDevice(new Temperature("Grijalica"));
       bedroom2.addDevice(new Light("Luster"));
       bedroom2.addDevice(new Temperature("Radijator"));
       bathroom.addDevice(new Temperature("Grijalica"));
       bathroom.addDevice(new Light("Lampa"));


       /*GUI*/
       while(true){
            Console.WriteLine("******SMARTHOME******");
            Console.WriteLine("1. Odaberite sobu za upravljanje");
            Console.WriteLine("2. Prikaz svih soba i stanja uredaja u njima");
            Console.WriteLine("3. Dodaj novi uredaj u sobu");
            Console.WriteLine("0. Izlaz");

            int glavnaOpcija;
            if(!int.TryParse(Console.ReadLine(), out glavnaOpcija)){
                Console.WriteLine("Nije unesena nijedna od ponudenih opacija!");
                continue;
            }

            if(glavnaOpcija==0){
                Console.WriteLine("Dovidenja!");
                break;
            }else if(glavnaOpcija==1){
                home.UpravljalSobama();
             }else if(glavnaOpcija==2){
                home.PrikaziSobe();
             }else if(glavnaOpcija==3){
               home.DodajUredajUSobu();
             }else{
                Console.WriteLine("Neispravna opcija!");
             }
       }

     }
}