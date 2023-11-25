#include<stdio.h>

int main(){
    int guess;
    printf("Pick a number 0..3: ");
    scanf("%d", &guess);
    switch(guess){
        case 0: printf("Not close\n");break;
        case 1: printf("Close\n");break;
        case 2: printf("Right on\n");break;
        case 3: printf("Too high\n");break;
    }
    return 0;
}