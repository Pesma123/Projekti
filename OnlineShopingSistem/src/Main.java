import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Korpa cart = new Korpa();

        while (true) {
            System.out.println("\n1. Dodaj Elektroniku");
            System.out.println("2. Dodaj Odjecu");
            System.out.println("3. Dodaj Hranu");
            System.out.println("4. Vidi korpu");
            System.out.println("5. Checkout");
            System.out.println("6. Exit");
            System.out.print("Odaberi opciju: ");

            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    System.out.print("Unesi ime proizvoda: ");
                    String eName = scanner.nextLine();
                    System.out.print("Unesi cijenu: ");
                    double ePrice = scanner.nextDouble();
                    scanner.nextLine();
                    System.out.print("Unesi brend: ");
                    String brand = scanner.nextLine();
                    cart.addProduct(new Elektronika(eName, ePrice, brand));
                    break;

                case 2:
                    System.out.print("Unesi ime odjece: ");
                    String cName = scanner.nextLine();
                    System.out.print("Unesi cijenu: ");
                    double cPrice = scanner.nextDouble();
                    scanner.nextLine();
                    System.out.print("Unesi velicinu: ");
                    String size = scanner.nextLine();
                    cart.addProduct(new Odjeca(cName, cPrice, size));
                    break;

                case 3:
                    System.out.print("Unesi hranu: ");
                    String gName = scanner.nextLine();
                    System.out.print("Unesi cijenu: ");
                    double gPrice = scanner.nextDouble();
                    System.out.print("Unesi tezinu (kg): ");
                    double weight = scanner.nextDouble();
                    cart.addProduct(new hrana(gName, gPrice, weight));
                    break;

                case 4:
                    cart.viewCart();
                    break;

                case 5:
                    cart.checkout();
                    break;

                case 6:
                    System.out.println("Hvala Vam sto ste kupovali sa nama!");
                    scanner.close();
                    return;

                default:
                    System.out.println("Netačan izbor.Pokušajte ponovo");
            }
        }
    }
}
