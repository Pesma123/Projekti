using System;
/*Dodana klasa SmartHome koja nam rukovodi sa svim metodama koje poziva iz Main-a*/
class SmartHome {
    private List<Room> rooms;
    public SmartHome(){
        rooms=new List<Room>();
    }
    public void dodajSobu(Room room) {
        rooms.Add(room);
    }

    public void PrikaziSobe(){
        Console.WriteLine("Lista svih soba sa uredjajima: ");
        foreach(var room in rooms){
            room.statusOfRoom();
        }
    }
    public void UpravljalSobama(){
              Console.WriteLine("Odaberite sobu: ");
                  for(int i=0 ; i<rooms.Count ; i++){
                 Console.WriteLine($"{i+1}. {rooms[i].nameOfTheRoom}");
                  }
                 Console.WriteLine("0. Izlaz");

                 int roomChosen=int.Parse(Console.ReadLine());
                 if(roomChosen==0) return;

                 Room selectedRoom=rooms[roomChosen-1];
                 selectedRoom.devicesInRoom();

                Console.WriteLine("Za odabranu sobu odaberite uredaj: ");
                 int deviceChoosen=int.Parse(Console.ReadLine());
                Device selectedDevice=selectedRoom.devices[deviceChoosen-1];

                 Console.WriteLine($"Upravljanje uredaje: {selectedDevice.Naziv}");
                 Console.WriteLine("1. Ukljuci ");
                 Console.WriteLine("2. Iskljuci ");

                if(selectedDevice is Light){
                  Console.WriteLine("3. Postavi jacinu svijetla");
                  Console.WriteLine("4. Promijeni boju");
                  }else if(selectedDevice is Temperature){
                      Console.WriteLine("3. Postavi ciljanu temp");
                      Console.WriteLine("4. Promijeni rezim rada");
                      }
                  Console.WriteLine("5. Obrisi uredaj iz sobe");
                  Console.Write("Odaberite akciju: ");
                 int action=int.Parse(Console.ReadLine());

                 if(action==1) selectedDevice.ukljuciUredjaj(); 
                 if(action==2) selectedDevice.iskljuciUredjaj();

                   else if(action==3 && selectedDevice is Light svijetlo1){
                 Console.WriteLine("Unesite jacinu svijetla (0-100): ");
                 int jacina=int.Parse(Console.ReadLine());
                 svijetlo1.setIntensity(jacina);
                }
                 else if(action==4 && selectedDevice is Light svijetlo){
                    Console.WriteLine("Unesite novu boju svijetla: ");
                    string boja=Console.ReadLine();
                     svijetlo.changeTheColor(boja);
                  }else if(action==3 && selectedDevice is Temperature temperatura1){
                     Console.WriteLine("Unesite idealnu temperaturu: ");
                      int temp=int.Parse(Console.ReadLine());
                      temperatura1.setIdealTemp(temp);
                 }else if(action==4 && selectedDevice is Temperature temperatura){
                     Console.WriteLine("Unesite novi rezim rada ('Grijanje', 'Hladenje', 'Iskljuceno'): ");
                      string noviRezim=Console.ReadLine();
                     temperatura.setMode(noviRezim);
                    }else if(action==5){
                        selectedRoom.removeDevice(selectedDevice.Naziv);
                    }else Console.WriteLine("Neispravna opcija.");
    }
    public void DodajUredajUSobu(){
         Console.WriteLine("U koju sobu zelite dodati uredaj: ");
                for(int i=0 ; i<rooms.Count ; i++){
                    Console.WriteLine($"{i+1}.{rooms[i].nameOfTheRoom}");
                }
                Console.WriteLine("0. Vrati se nazad");

                int odabir;
                if(!int.TryParse(Console.ReadLine(), out odabir) || odabir<0 || odabir>rooms.Count){
                    Console.WriteLine("Greska!");
                    return;
                }
                if(odabir==0) return;

                Room odabranaSoba=rooms[odabir-1];
                Console.WriteLine("Kako se zove novi uredaj: ");
                string nazivUredjaja=Console.ReadLine();
                Console.WriteLine("Koji je tip uredjaja: ");
                Console.WriteLine("1. Light(Svijetlo)");
                Console.WriteLine("2. Temperature");

                int tip;
                if(!int.TryParse(Console.ReadLine(), out tip) || (tip!=1 && tip!=2)){
                    Console.WriteLine("Greska!");
                    return;
                }

                Device novi;
                if(tip==1){
                    novi=new Light(nazivUredjaja);
                }else{
                    novi=new Temperature(nazivUredjaja);
                }

                odabranaSoba.addDevice(novi);
                Console.WriteLine($"Uredjaj {nazivUredjaja} je dodan u sobu {odabranaSoba}.");
    }
}