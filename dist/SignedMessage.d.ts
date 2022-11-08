/**
* Signed message object. Your friends can index and relay your messages, while others can still verify that they were signed by you.
*
* Fields: signedData, signer (public key) and signature.
*
* signedData has an author, signer, type, time and optionally other fields.
*
* signature covers the utf8 string representation of signedData. Since messages are digitally signed, users only need to care about the message signer and not who relayed it or whose index it was found from.
*
* signer is the entity that verified its origin. In other words: message author and signer can be different entities, and only the signer needs to use Iris.
*
* For example, a crawler can import and sign other people's messages from Twitter. Only the users who trust the crawler will see the messages.
*
* Constructor: creates a message from the param obj.signedData that must contain at least the mandatory fields: author, type and time.
* @param obj
*
*/
declare class SignedMessage {
    signedData: any;
    pubKey: any;
    sig: any;
    constructor(obj: any);
    getSignerKeyID(): any;
    _validate(): boolean;
    /**
    * @param {Object} key keypair to sign the message with
    */
    sign(key: any): Promise<boolean>;
    /**
    * Create an iris message. SignedMessage time is automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
    * @param {Object} signedData message data object including author, recipient and other possible attributes
    * @param {Object} signingKey optionally, you can set the key to sign the message with
    * @returns {Promise<SignedMessage>}  message
    */
    static create(signedData: any, signingKey: any): Promise<SignedMessage>;
    getAuthor(index: any): any;
    getRecipient(index: any): any;
    /**
    * @returns {string} base64 sha256 hash of message
    */
    getHash(): Promise<any>;
    getId(): Promise<any>;
    static fromSig(obj: any): Promise<SignedMessage>;
    /**
    * @return {boolean} true if message signature is valid. Otherwise throws ValidationError.
    */
    verify(): Promise<boolean>;
    /**
    * @returns {string}
    */
    serialize(): {
        sig: any;
        pubKey: any;
    };
    toString(): string;
    /**
    * @returns {Promise<SignedMessage>}
    */
    static deserialize(s: any): Promise<SignedMessage>;
    static fromString(s: any): Promise<SignedMessage>;
}
export default SignedMessage;
