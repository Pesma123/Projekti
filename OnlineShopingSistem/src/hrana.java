public class hrana extends Proizvod{
    private double weight;

    public hrana(String name, double price, double weight) {
        super(name, price);
        this.weight = weight;
    }

    @Override
    public void displayDetails() {
        System.out.println("Grocery: " + name + " | Weight: " + weight + "kg | Price: $" + price);
    }
}
