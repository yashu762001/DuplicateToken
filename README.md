<h1> Duplicate Token </h1>
<h1> Token Symbol : DUPL </h1>

<h2>Author : Yash Mathur </h2>

<li>
 <ul><p> So, I am very happy to announce the Duplicate Token. I minted 1 million tokens at a price of $2. </p> </ul>
 <ul> <p>This is a ERC20 Token. </p> </ul>
 <ul> <p>All the tokens are identical and possess similar value </p> </ul>
  
  </li>
  
  
 <p> Currently I hold all the tokens and I have not thought of making it public but would definitely think of doing it when I"ll feel these tokens can be valuable plus I am able to build a community which people beleive in. </p>
 
 <h2> TechStack Involved : </h2>
 <li>
  <ul> Solidity </ul>
  <ul> Hardhat JS </ul>
  <ul> Ethers Library </ul>
</li>

<h2> Learning Outcomes : </h2>
<li>
  <ul> Got to know about about ERC20 Standards and why is it important. If I have to explain in brief this standard allows different exchanges to very
    easily add any token onto their platform. Because if every token follows different way of writing smart contract then it becomes very difficult to add
    them onto the platform since on backend new function calls will be needed to make for every subsequent token. </ul>
  
  </li>
  
 <h2> Difficulties Faced : </h2>
 
 <li>
  <ul> The maximum that I spent upon was writing a test for transfer function. Lots of errors were coming and Promise I was generating was not getting 
    resolved due to a error named Arithmetic Error. So basically I was updating balances but there I was subtracting tokens from someone who doesn't
    even hold them and since any new address holds 0 tokens so we cannot subtract any value from 0. It took me a bit of time to understand the error and
   the resolve it. </ul>
  
    <ul> The second problem I faced was again in same test but this time issue was that transfer function was checking whether token request made
      is valid or not. On the other hand there was a separate payable fund function which was transferring ethereum from user's wallet to contract
      and sending the user Duplicate Tokens. But issue there was that I was updating balances of msg.sender but actually I was supposed to update
      balance of contract owner since when fund function was called msg.sender was actually user who was requesting ethereum transfer in return
      for tokens. But since I was updating balance of msg.sender so during call msg.sender was user who had 0 tokens initially and hence when I
      was subtracting once again it gave Arithmetic Error. </ul>
      
      </li>
      
      <h3> So Majorly I learnt to handle the Arithmetic Errors from this project. </h3>
      
