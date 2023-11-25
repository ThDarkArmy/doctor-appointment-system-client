import java.util.Scanner;
public class Solution{
    public static void main(String[] args){
        // Instantiating scanner class for taking input
        Scanner scanner = new Scanner(System.in);

        // Displaying the instruction for input
        System.out.print("Enter a string: ");

        // taking input for string
        String str = scanner.nextLine();

        // find the length of the input string
        int length = str.length();

        // finding the first character of the string
        char c = str.charAt(0);

        // printing the result
        System.out.println("The string is of length "+length+" and the first character is "+c);
        // closing the scanner object 
        scanner.close();
    }
}