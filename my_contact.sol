// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";

// The CubeMarketplace contract inherits from ERC721, which is the base contract for non-fungible tokens.
contract CubeMarketplace is ERC721 {
    struct User {
        //address is unique, users are initiliazed a resource responding to their own address
        mapping (address => bool) ownedResources;
        //cubes are ordered from 0 and the index represents unique cube
        mapping (uint256 => bool) ownedCubes;
        uint256 cubeCount;
        uint256 resourcesCount;
        uint256 balance;
    }

    //Global variables
    //store address and users,
    //and keep track of current cube number.
    mapping (address => User) public users;
    uint256 public curCube;

    // Event emitted when a new cube is minted
    event CubeMinted(address indexed owner, uint256 indexed tokenId);

    constructor() ERC721("Cube", "CB") {}

    // Initialize a new user with resources
    function initializeUser(uint256 _initial_balance) external {
        require(users[msg.sender].resourcesCount < 1, "User already initialized");
        users[msg.sender].resourcesCount = 1;
        users[msg.sender].ownedResources[msg.sender] = true;
        users[msg.sender].balance = _initial_balance;
    }

    // Mint a new cube and assign it to the owner
    function mintCube() external {
        require(users[msg.sender].resourcesCount >= 4, "Insufficient resources to mint cube");
        users[msg.sender].ownedCubes[curCube] = true;
        users[msg.sender].cubeCount++;
        _safeMint(msg.sender, curCube);
        emit CubeMinted(msg.sender, curCube);
        curCube++;
    }

    // Allow a user to buy a cube from the market
    function tradeCube(address seller, address buyer, uint256 _tokenId, uint256 price) public payable {
        // address owner = ownerOf(_tokenId);
        // require(owner != address(0), "ERC721: token owner query for nonexistent token");
        require(price > 0, "Price must be non-negative");
        require(users[buyer].balance >= price, "Insufficient balance");
        require(_exists(_tokenId), "ERC721: token does not exist");
        address owner = ownerOf(_tokenId);
        // require(msg.sender == owner, "ERC721: caller is not the owner");
        require(seller == owner, "ERC721: caller is not the owner");
        users[buyer].ownedCubes[_tokenId] = true;
        users[seller].ownedCubes[_tokenId] = false;
        users[buyer].balance -= price;
        users[seller].balance += price;
        // address payable seller = payable(owner);
        // seller.transfer(price);
        // safeTransferFrom(owner, msg.sender, _tokenId);
        emit CubeSold(_tokenId, price, seller);
    }
    

    function exchangeResources(address _user1, address _user2) external {
        User storage user1 = users[_user1];
        User storage user2 = users[_user2];
        //gaurantee two existing users
        // require(user1.resourcesCount > 0 && user2.resourcesCount > 0, "Both users must have resources");
        
        // uint256 tempResources = user1[msg.sender].resources;
        // require(user1.ownedResources[_user2] == false && user2.ownedResources[_user1] == false, "You have exchanged before");
        user1.ownedResources[_user2] = true;
        users[_user1].resourcesCount++;
        user2.ownedResources[_user1] = true;
        users[_user2].resourcesCount++;
        
    }

    // Event emitted when a cube is put up for sale
    event CubeForSale(uint256 indexed tokenId, uint256 price);

    // Event emitted when a cube is sold
    event CubeSold(uint256 indexed tokenId, uint256 price, address buyer);
}