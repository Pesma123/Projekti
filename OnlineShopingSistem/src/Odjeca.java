public class Odjeca extends Proizvod{
    private String size;

    public Odjeca(String name, double price, String size) {
        super(name, price);
        this.size = size;
    }

    @Override
    public void displayDetails() {
        System.out.println("Clothing: " + name + " | Size: " + size + " | Price: $" + price);
    }
}
