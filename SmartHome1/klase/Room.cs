public class Room {
    public string nameOfTheRoom {get; set; }
    public List<Device> devices {get; private set;}

    public Room(string name){
        nameOfTheRoom=name;
        devices=new List<Device>(); 
    }

    /*metoda za dodavanje uredaja u sobu*/
    public void addDevice(Device device){
        devices.Add(device);
    }

    /*metoda za brisanje uredaja iz sobe*/
   public void removeDevice(String nazivUredjaja){
    Device zaBrisati=devices.FirstOrDefault(u=>u.Naziv == nazivUredjaja);
    if(zaBrisati !=null){
        devices.Remove(zaBrisati);
        Console.WriteLine($"Uredjaj {nazivUredjaja} je obrisan.");
    }else{
        Console.WriteLine("Navedeni uredjaj nije pronadjen.");
    }
   }


    //prikaz stanja u pojedinacnim sobama
    public void devicesInRoom() {
        Console.WriteLine($"Devices in room: {nameOfTheRoom}");
        foreach(var device in devices){
            device.prikaziStatus();
        }
    }

    //odabir pojedinacnog uredaja po sobama
    public Device chooseDevice(){
        Console.WriteLine("\nChoose a device: ");
        for(int i=0 ; i<devices.Count ; i++){
            Console.WriteLine($"{i+1}.{devices[i].Naziv}");
        }
    
     int izbor = int.Parse(Console.ReadLine()) - 1;
        return devices[izbor];
    }

    public void statusOfRoom(){
        Console.WriteLine($"\nStatus uredaja u sobi: {nameOfTheRoom}");
        foreach(var device in devices){
            device.prikaziStatus();
        }
    }
}