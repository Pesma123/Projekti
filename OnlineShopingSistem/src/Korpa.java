import java.util.ArrayList;
import java.util.List;

class Korpa {
    private List<Proizvod> cart;

    public Korpa() {
        cart = new ArrayList<>();
    }

    public void addProduct(Proizvod product) {
        cart.add(product);
        System.out.println(product.getName() + " added to cart.");
    }

    public void viewCart() {
        if (cart.isEmpty()) {
            System.out.println("Your cart is empty.");
            return;
        }
        System.out.println("Your Shopping Cart:");
        for (Proizvod p : cart) {
            p.displayDetails();
        }
    }

    public double calculateTotal() {
        double total = 0;
        for (Proizvod p : cart) {
            total += p.getPrice();
        }
        return total;
    }

    public void checkout() {
        if (cart.isEmpty()) {
            System.out.println("Your cart is empty. Add items before checkout.");
            return;
        }
        System.out.println("Total amount: $" + calculateTotal());
        System.out.println("Thank you for your purchase!");
        cart.clear();
    }
}

