public class Elektronika  extends Proizvod{
    private String brand;

    public Elektronika(String name, double price, String brand) {
        super(name, price);
        this.brand = brand;
    }

    @Override
    public void displayDetails() {
        System.out.println("Electronics: " + name + " | Brand: " + brand + " | Price: $" + price);
    }
}
