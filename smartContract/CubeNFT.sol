// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CubeNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Cube {
        string color;
        string material;
    }

    mapping(uint256 => Cube) private cubes;
    constructor() ERC721("CubeNFT", "CUBE") {}

    function mintCube(string memory color, string memory material) public {
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(msg.sender, newItemId);
        Cube memory newCube = Cube({
            color: color,
            material: material
        });
        cubes[newItemId] = newCube;
    }

    function transferCube(uint256 tokenId) public {
        require(msg.sender != _ownerOf(tokenId), "Owner cannot send cube to self.");
        _transfer(_ownerOf(tokenId), msg.sender, tokenId);
    }

    function getCubeInfo(uint256 tokenId) public view returns (string memory color, string memory material, address owner) {
        require(_exists(tokenId), "CubeNFT: Cube does not exist");
        Cube memory cube = cubes[tokenId];
        owner = ownerOf(tokenId);
        return (cube.color, cube.material, owner);
}

}
