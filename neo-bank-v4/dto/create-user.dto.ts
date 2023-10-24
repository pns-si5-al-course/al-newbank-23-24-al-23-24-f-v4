export class UserDto {
    readonly name: string;
    readonly accounts: Array<{ currency: string, sum: number}>;
}