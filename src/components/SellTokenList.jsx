import React, { useEffect, useState } from "react";
import { MAINNET_TOKENS } from "../utils/constants";
import { CgSearch } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import options from "../constants";
import eth from '../assets/eth.svg'


const baseaddresses = [
  // "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  // "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
  // "0xB1a03EdA10342529bBF8EB700a06C60441fEf25d",
  // "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  // "0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842",
  // "0x2615a94df961278DcbC41Fb0a54fEc5f10a693aE",
  // "0x9a26F5433671751C3276a065f57e5a02D2817973",
  // "0x768BE13e1680b5ebE0024C42c896E3dB59ec0149",
  // "0x2Da56AcB9Ea78330f947bD57C54119Debda7AF71",
  // "0xA88594D404727625A9437C3f886C7643872296AE",
  // "0xc4441c2be5d8fa8126822b9929ca0b81ea0de38e",
  "0xca73ed1815e5915489570014e024b7ebe65de679",
  "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
  "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
  "0x3e43cb385a6925986e7ea0f0dcdaec06673d4e10",
  "0x6b2504a03ca4d43d0d73776f6ad46dab2f2a4cfd",
  "0xf7b0dd0b642a6ccc2fc4d8ffe2bffb0cac8c43c8",
  "0x7a5f5ccd46ebd7ac30615836d988ca3bd57412b3",
  "0x583c5c735a90792e122ddcd2e9e82ff743489174",
  "0x474f4cb764df9da079d94052fed39625c147c12c",
  "0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825",
  "0x532f27101965dd16442e59d40670faf5ebb142e4",
  "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
  "0x768be13e1680b5ebe0024c42c896e3db59ec0149",
  "0x37e0b50ddbd719a46b9660396114c7f3fc9aa076",
  "0x322eeb45f496fa11b0134d14bf5758d4d6f7ba3c",
  "0x52b492a33e447cdb854c7fc19f1e57e8bfa1777d",
  "0xdbfefd2e8460a6ee4955a68582f85708baea60a3",
  "0xef22cb48b8483df6152e1423b19df5553bbd818b",
  "0xfc48314ad4ad5bd36a84e8307b86a68a01d95d9c",
  "0x106c8a8ba4d7fcc70e35a3ffaa35252047bc5271",
  "0xb9a5f238dc61eebe820060226c8143cd24624771",
  "0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452",
  "0x6985884c4392d348587b19cb9eaaf157f13271cd",
  "0x04c0599ae5a44757c0af6f9ec3b93da8976c150a",
  "0x20d704099b62ada091028bcfc44445041ed16f09",
  "0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842",
  "0x1c4cca7c5db003824208adda61bd749e55f463a3",
  "0xeb6d78148f001f3aa2f588997c5e102e489ad341",
  "0x55cd6469f597452b5a7536e2cd98fde4c1247ee4",
  "0x55cd6469f597452b5a7536e2cd98fde4c1247ee4",
];  

const ethaddresses = [
  "0xc4441c2be5d8fa8126822b9929ca0b81ea0de38e",
  "0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee",
  "0x57e114b691db790c35207b2e685d4a43181e6061",
  "0xadd39272e83895e7d3f244f696b7a25635f34234",
  "0x6982508145454ce325ddbe47a25d4ec3d2311933",
  "0x514910771af9ca656af840dff83e8264ecf986ca",
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  "0xec53bf9167f50cdeb3ae105f56099aaab9061f83",
  "0x64c5cba9a1bfbd2a5faf601d91beff2dcac2c974",
  "0x62d0a8458ed7719fdaf978fe5929c6d342b0bfce",
  "0x1121acc14c63f3c872bfca497d10926a6098aac5",
  "0x44ff8620b8ca30902395a7bd3f2407e1a091bf73",
  "0x0000000000c5dc95539589fbd24be07c6c14eca4",
  "0xaaee1a9723aadb7afa2810263653a34ba2c21c7a",
  "0x39d5313c3750140e5042887413ba8aa6145a9bd2",
  "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3",
  "0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3",
  "0x5a3e6a77ba2f983ec0d371ea3b475f8bc0811ad5",
  "0xcdbddbdefb0ee3ef03a89afcd714aa4ef310d567",
  "0x3b991130eae3cca364406d718da22fa1c3e7c256",
  "0x58d97b57bb95320f9a05dc918aef65434969c2b2",
  "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24",
  "0x2e44f3f609ff5aa4819b323fd74690f07c3607c4",
  "0x111111111117dc0aa78b770fa6a738034120c302",
  "0x77e06c9eccf2e797fd462a92b6d7642ef85b0a44",
  "0x50327c6c5a14dcade707abad2e27eb517df87ab5",
  "0x1495bc9e44af1f8bcb62278d2bec4540cf0c05ea",
  "0x812ba41e071c7b7fa4ebcfb62df5f45f6fa853ee",
  "0x72e4f9f808c49a2a61de9c5896298920dc4eeea9",
];

const polygonaddresses = [
  "0xeb51d9a39ad5eef215dc0bf39a8821ff804a0f01",
  "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
  "0x45b0bf770edad9b3a8aaa015b47a1f46a7cf956f",
  "0x3d2bd0e15829aa5c362a4144fdf4a1112fa29b5c",
  "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7",
  "0x714db550b574b3e927af3d93e26127d15721d4c2",
  "0xc3c7d422809852031b44ab29eec9f1eff2a58756",
  "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
  "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
  "0xc3ec80343d2bae2f8e680fdadde7c17e71e114ea",
  "0xb5c064f955d8e7f38fe0460c556a72987494ee17",
  "0x61299774020da444af134c82fa83e3810b309991",
  "0xac0f66379a6d7801d7726d5a943356a172549adb",
  "0xe5417af564e4bfda1c483642db72007871397896",
  "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
  "0x8349314651ede274f8c5fef01aa65ff8da75e57c",
  "0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32",
  "0x03b54a6e9a984069379fae1a4fc4dbae93b3bccd",
  "0x311434160d7537be358930def317afb606c0d737",
  "0x172370d5cd63279efa6d502dab29171933a610af",
  "0x0566c506477cd2d8df4e0123512dbc344bd9d111",
  "0x658cda444ac43b0a7da13d638700931319b64014",
  "0x683565196c3eab450003c964d4bad1fd3068d4cc",
  "0x235737dbb56e8517391473f7c964db31fa6ef280",
  "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
  "0x94b959c93761835f634b8d6e655070c58e2caa12",
  "0x229b1b6c23ff8953d663c4cbb519717e323a0a84",
  "0x4e78011ce80ee02d2c3e649fb657e45898257815",
  "0x204820b6e6feae805e376d2c6837446186e57981",
  "0xe06bd4f5aac8d0aa337d13ec88db6defc6eaeefe",
];

const arbitrumaddresses = [
  "0x6985884c4392d348587b19cb9eaaf157f13271cd",
  "0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8",
  "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
  "0xba5ddd1f9d7f570dc94a51479a000e3bce967196",
  "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
  "0x539bde0d7dbd336b79148aa742883198bbf60342",
  "0xb08d8becab1bf76a9ce3d2d5fa946f65ec1d3e83",
  "0x2416092f143378750bb29b79ed961ab195cceea5",
  "0x9623063377ad1b27544c965ccd7342f7ea7e88c7",
  "0x4cb9a7ae498cedcbb5eae9f25736ae7d428c9d66",
  "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0",
  "0x88a269df8fe7f53e590c561954c52fccc8ec0cfb",
  "0x18c11fd286c5ec11c3b683caa813b77f5163a122",
  "0x3d9907f9a368ad0a51be60f7da3b97cf940982d8",
  "0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60",
  "0x7f9fbf9bdd3f4105c478b996b648fe6e828a1e98",
  "0x93fa0b88c0c78e45980fa74cdd87469311b7b3e4",
  "0x4e200fe2f3efb977d5fd9c430a41531fb04d97b8",
  "0xdadeca1167fe47499e53eb50f261103630974905",
  "0x7189fb5b6504bbff6a852b13b7b82a3c118fdc27",
  "0xc87b37a581ec3257b734886d9d3a581f5a9d056c",
  "0xd77b108d4f6cefaa0cae9506a934e825becca46e",
  "0xa61f74247455a40b01b0559ff6274441fafa22a3",
  "0x772598e9e62155d7fdfe65fdf01eb5a53a8465be",
  "0x65c936f008bc34fe819bce9fa5afd9dc2d49977f",
  "0x9842989969687f7d249d01cae1d2ff6b7b6b6d35",
  "0x09e18590e8f76b6cf471b3cd75fe1a1a9d2b2c2b",
  "0xc760f9782f8cea5b06d862574464729537159966",
  "0x999999990237e901c537bbd768e09562be02efa5",
  "0x2bcc6d6cdbbdc0a4071e48bb3b969b06b3330c07",
];


const mantleaddresses = [
  "0xe6829d9a7ee3040e1276fa75293bde931859e8fa",
  "0xc96de26018a54d51c097160568752c4e3bd6c364",
  "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
  "0x4515a45337f461a11ff0fe8abf3c606ae5dc00c9",
  "0xc1e0c8c30f251a07a894609616580ad2ceb547f2",
  "0x9f0c013016e8656bc256f948cd4b79ab25c7b94d",
  "0x371c7ec6d8039ff7933a2aa28eb827ffe1f52f07",
  "0x25356aeca4210ef7553140edb9b8026089e49396",
  "0x58538e6a46e07434d7e7375bc268d3cb839c0133",
  "0x1bdd8878252daddd3af2ba30628813271294edc0",
  "0x33096c86d18f87df93cec2f860470e93fea0fb87",
  "0xacca45cf3bd3d0163c27e5cedbbacb86b259af7c",
  "0x59f3e30980e4759927f31e0dfe22de8f49d70591",
  "0x779f4e5fb773e17bc8e809f4ef1abb140861159a",
  "0x1cef10e5079c48578ec761096a1f9ffd9b8a5664",
  "0xfc3905eac87a7cb18601176f33cb81954a862802",
  "0xf763889271252c81bcb8396e254ef95b1f8b8926",
  "0x7ab758a5c558d63022216cf9afeb9982ae87adf9",
  "0x94338ade617d6573d50f0f50b18395686dfaa200",
  "0xc01a7ad7fb8a085a3cc16be8eaa10302c78a1783",
  "0xcffbe0e73c750731edb38c14bc81a39dac91819d",
  "0x8309bc8bb43fb54db02da7d8bf87192355532829",
  "0x71bac957ab57247d80f32d10a96cf76989192f38",
  "0x5a093a9c4f440c6b105f0af7f7c4f1fbe45567f9",
  "0x74262b38609a4155eab4eecfdcd0e339da2cf1b2",
  "0xd27b18915e7acc8fd6ac75db6766a80f8d2f5729",
  "0x7e51ad847cdf8729efc97cfa6e8afa4d658cb85b",
  "0x458ed78eb972a369799fb278c0243b25e5242a83",
  "0x4e0285462d9592fdcef54c9b0f8435814096c299",
  "0x1a3156169361634bc116fa7548080f2f7aca35d2",
];

const blastaddresses = [
  "0xb1a5700fa2358173fe465e6ea4ff52e36e88e2ad",
  "0x2416092f143378750bb29b79ed961ab195cceea5",
  "0xe36072dd051ce26261bf50cd966311cab62c596e",
  "0xf7bc58b8d8f97adc129cfc4c9f45ce3c0e1d2692",
  "0x1f55a02a049033e3419a8e2975cf3f572f4e6e9a",
  "0x1a49351bdb4be48c0009b661765d01ed58e8c2d8",
  "0x52f847356b38720b55ee18cb3e094ca11c85a192",
  "0x216a5a1135a9dab49fa9ad865e0f22fe22b5630a",
  "0x97ecad323f63060df37ff0cf05350803db4d17bd",
  "0xd79d6fe06f4c2b17291015169d1443f50d0c2838",
  "0x04c0599ae5a44757c0af6f9ec3b93da8976c150a",
  "0xec73284e4ec9bcea1a7dddf489eaa324c3f7dd31",
  "0x73c369f61c90f03eb0dd172e95c90208a28dc5bc",
  "0x59c159e5a4f4d1c86f7abdc94b7907b7473477f6",
  "0x15d24de366f69b835be19f7cf9447e770315dd80",
  "0x491e6de43b55c8eae702edc263e32339da42f58c",
  "0xb9dfcd4cf589bb8090569cb52fac1b88dbe4981f",
  "0xb5a86030b64afaa75c42c0d28f8d5ce5f9f61401",
  "0x20fe91f17ec9080e3cac2d688b4ecb48c5ac3a9c",
  "0xff76ca0b2006183abeb22ccb56740083a68767ed",
  "0x09f1917d968a3ee1355e61fb6a0347de614116af",
  "0xbb4e01b8940e8e2b3a95ced7941969d033786ff7",
  "0x1d7c5909500ebc2e5dd22765a27f0f46a810489e",
  "0xca84812e477ee5a96a92328689d8ce2589ab6ffd",
  "0x818a92bc81aad0053d72ba753fb5bc3d0c5c0923",
  "0x9e0d7d79735e1c63333128149c7b616a0dc0bbdb",
  "0x23432452b720c80553458496d4d9d7c5003280d0",
  "0x3b0cffda9a5ab64135c227638e777ceec0c243a8",
  "0x67fa2887914fa3729e9eed7630294fe124f417a0",
  "0x9e92c0b2b84ddac571bde330c4b44096a7c99909",
];

const modeaddresses = [
  "0xdfc7c877a950e49d2610114102175a06c2e3167a",
  "0xfda619b6d20975be80a10332cd39b9a4b0faa8bb",
  "0x2416092f143378750bb29b79ed961ab195cceea5",
  "0x7f9adfbd38b669f03d1d11000bc76b9aaea28a81",
  "0x6863fb62ed27a9ddf458105b507c15b5d741d62e",
  "0x95177295a394f2b9b04545fff58f4af0673e839d",
  "0xcdd475325d6f564d27247d1dddbb0dac6fa0a5cf",
  "0xe7903b1f75c534dd8159b313d92cdcfbc62cb3cd",
  "0x028227c4dd1e5419d11bb6fa6e661920c519d4f5",
  "0x04c0599ae5a44757c0af6f9ec3b93da8976c150a",
  "0x18470019bf0e94611f15852f7e93cf5d65bc34ca",
  "0xcda802a5bffaa02b842651266969a5bba0c66d3e",
  "0x59889b7021243db5b1e065385f918316cd90d46c",
  "0x7e0ddf49f70a1916849523d3f43dd5aff27c6587",
  "0xdfd0660032c2d0d38a9092a43d1669d6568caf71",
  "0x80137510979822322193fc997d400d5a6c747bf7",
  "0xee1b67de81000336badf6f69fe1eb9702c054f4b",
  "0x0fa000cf4018e7a5069437a06f73120db0b53a90",
  "0xf15578bcdb3ccba8585c563af9aae200c1413bca",
  "0xd2ecb0cb0a65479d18b291c3c0f18130e7973c35",
  "0xd2ecb0cb0a65479d18b291c3c0f18130e7973c35",
  "0x8b2eea0999876aab1e7955fe01a5d261b570452c",
  "0x66eed5ff1701e6ed8470dc391f05e27b1d0657eb",
  "0x02f92800f57bcd74066f5709f1daa1a4302df875",
  "0xfa1d1f89e64a1b5ba50fb867d2aa660d9e6de029",
  "0x77e7bcfee826b12cd498faa9831d7055b7478272",
  "0x84c535f33d236e0a241ac33114d5cbd1a0a0f01a",
  "0x4186bfc76e2e237523cbc30fd220fe055156b41f",
  "0xd0d1b59ca62ce194e882455fd36632d6277b192a",
  "0xe7798f023fc62146e8aa1b36da45fb70855a77ea",
];

const scrolladdresses = [
  "0xa25b25548b4c98b0c7d3d27dca5d5ca743d68b7f",
  "0xf610a9dfb7c89644979b4a0f27063e9e7d7cda32",
  "0x3c1bca5a656e69edcd0d4e36bebb3fcdaca60cf1",
  "0x80137510979822322193fc997d400d5a6c747bf7",
  "0xd44605d3e5ef9a73379ce5258b06e4383c6ff32a",
  "0xaaae8378809bb8815c08d3c59eb0c7d1529ad769",
  "0x01f0a31698c4d065659b9bdc21b3610292a1c506",
  "0x2147a89fb4608752807216d5070471c09a0dce32",
  "0x434cda25e8a2ca5d9c1c449a8cb6bcbf719233e8",
  "0xecc68d0451e20292406967fe7c04280e5238ac7d",
  "0xaa2e06a56868ba864085d983eca4cc432e08a6ac",
  "0x2fc5cf65fd0a660801f119832b2158756968266d",
  "0x6b7d1c9d519dfc3a5d8d1b7c15d4e5bbe8dde1cf",
  "0x44f96348916c0769ff738d916eb481f71ccfd18b",
  "0x608ef9a3bffe206b86c3108218003b3cfbf99c84",
  "0x54d9edd981222b766472c0d7c1c8e5ccbabdb429",
  "0x0fc479e2f9b7310bfb1db606cf565dea6910eedc",
  "0xddeb23905f6987d5f786a93c00bbed3d97af1ccc",
  "0x330c43d22bd65a60ffea93a197f04e87faa27b70",
  "0x549423e69576b80e91dc836ae37e04209660c4ec",
  "0xc4d46e8402f476f269c379677c99f18e22ea030e",
  "0x1467b62a6ae5cdcb10a6a8173cfe187dd2c5a136",
  "0x78ab77f7d590fb101aa18affc238cbfea31ead5b",
  "0xb65ad8d81d1e4cb2975352338805af6e39ba8be8",
  "0x9daea97fd467d704c583beda2454e3da27097b60",
  "0x95a52ec1d60e74cd3eb002fe54a2c74b185a4c16",
  "0x1a2fcb585b327fadec91f55d45829472b15f17a4",
  "0x0f1895d32579c7e97ba31caec0d4106ed84a9c49",
  "0x74ccbe53f77b08632ce0cb91d3a545bf6b8e0979",
  "0x912ab742e1ab30ffa87038c425f9bc8ed12b3ef4",
];

const lineaaddresses = [
  "0x3aab2285ddcddad8edf438c1bab47e1a9d05a9b4",
  "0x2416092f143378750bb29b79ed961ab195cceea5",
  "0x5fbdf89403270a1846f5ae7d113a989f850d1566",
  "0x1bf74c010e6320bab11e2e5a532b5ac15e0b8aa6",
  "0xd2671165570f41bbb3b0097893300b6eb6101e6c",
  "0xaaaac83751090c6ea42379626435f805ddf54dc8",
  "0x1a51b19ce03dbe0cb44c1528e34a7edd7771e9af",
  "0xb5bedd42000b71fdde22d3ee8a79bd49a568fc8f",
  "0xacb54d07ca167934f57f829bee2cc665e1a5ebef",
  "0x43e8809ea748eff3204ee01f08872f063e44065f",
  "0x78354f8dccb269a615a7e0a24f9b0718fdc3c7a7",
  "0x93f4d0ab6a8b4271f4a28db399b5e30612d21116",
  "0x45229ac791c56cb86fc1972f3082dab19385dfa2",
  "0x0d1e753a25ebda689453309112904807625befbe",
  "0x5ffce65a40f6d3de5332766fff6a28bf491c868c",
  "0x63349ba5e1f71252ecd56e8f950d1a518b400b60",
  "0x81be2acb2e9291db6400f9f6a4d0f35f24de2e77",
  "0xb3b3ca7cb0bccb6a9316764826324a312665dc53",
  "0xe4d584ae9b753e549cae66200a6475d2f00705f7",
  "0x265b25e22bcd7f10a5bd6e6410f10537cc7567e8",
  "0xec859566fc5d7ed84ac823509f3f7db06c461b20",
  "0x092b9e25a7d143c83d44c27194f5cee7c1150f22",
  "0xd96536b77ae5500fe850add2253bcf640e7824c1",
  "0x7d43aabc515c356145049227cee54b608342c0ad",
  "0xda7d3ef7c899079eb101f3b31c272dbe9639bda6",
  "0x880a3ae90f989030708a529abd841589053c1dc2",
  "0x7da14988e4f390c2e34ed41df1814467d3ade0c3",
  "0x8b9bb9c309e1838a2d9e435ebac3e8d928354215",
  "0x15eefe5b297136b8712291b632404b66a8ef4d25",
  "0xe07c2bdbb8c787962c2c6e93c11a152110e7e4d2",
];

const opaddresses = [
  "0x4200000000000000000000000000000000000042",
  "0x9560e827af36c94d2ac33a39bce1fe78631088db",
  "0x8700daec35af8ff88c16bdf0418774cb3d7599b4",
  "0xdc6ff44d5d932cbd77b52e5612ba0529dc6226f1",
  "0x3e29d3a9316dab217754d13b28646b76607c5f04",
  "0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6",
  "0x6c84a8f1c29108f47a79964b5fe888d4f4d0de40",
  "0x9e1028f5f1d5ede59748ffcee5532509976840e0",
  "0x6985884c4392d348587b19cb9eaaf157f13271cd",
  "0xc55e93c62874d8100dbd2dfe307edc1036ad5434",
  "0x300d2c875c6fb8ce4bf5480b4d34b7c9ea8a33a4",
  "0x2dad3a13ef0c6366220f989157009e501e7938f8",
  "0xd9cc3d70e730503e7f28c1b407389198c4b75fa2",
  "0x76fb31fb4af56892a25e32cfc43de717950c9278",
  "0x139052115f8b1773cf7dcba6a553f922a2e54f69",
  "0x3c8b650257cfb5f272f799f5e2b4e65093a11a05",
  "0x6806411765af15bddd26f8f544a34cc40cb9838b",
  "0x6fd9d7ad17242c41f7131d257212c54a0e816691",
  "0x2416092f143378750bb29b79ed961ab195cceea5",
  "0xf467c7d5a4a9c4687ffc7986ac6ad5a4c81e1404",
  "0x217d47011b23bb961eb6d93ca9945b7501a5bb11",
  "0x5a7facb970d094b6c7ff1df0ea68d99e6e73cbff",
  "0x46777c76dbbe40fabb2aab99e33ce20058e76c59",
  "0x0994206dfe8de6ec6920ff4d779b0d950605fb53",
  "0x3417e54a51924c225330f8770514ad5560b9098d",
  "0x259c1c2ed264402b5ed2f02bc7dc25a15c680c18",
  "0x50bce64397c75488465253c0a034b8097fea6578",
  "0xc3864f98f2a61a7caeb95b039d031b4e2f55e0e9",
  "0x14778860e937f509e651192a90589de711fb88a9",
  "0x298b9b95708152ff6968aafd889c6586e9169f1d",
];




const bnbaddresses = [
  "0xc748673057861a797275cd8a068abb95a902e8de",
  "0x96e8d3a52dd950aacc8d1749932e1c14bc76e371",
  "0xf563e86e461de100cfcfd8b65daa542d3d4b0550",
  "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
  "0x59e69094398afbea632f8bd63033bdd2443a3be1",
  "0xba2ae424d960c26247dd6c32edc70b295c744c43",
  "0x51363f073b1e4920fda7aa9e9d84ba97ede1560e",
  "0x6894cde390a3f51155ea41ed24a33a4827d3063d",
  "0xfb5b838b6cfeedc2873ab27866079ac55363d37e",
  "0x1a4c5c74fb1ec39e839799baa0a91caeaeadedf7",
  "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe",
  "0x4ad663403df2f0e7987bc9c74561687472e1611c",
  "0x26c5e01524d2e6280a48f2c50ff6de7e52e9611c",
  "0x9840652dc04fb9db2c43853633f0f62be6f00f98",
  "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
  "0xd5eaaac47bd1993d661bc087e15dfb079a7f3c19",
  "0xf86af2fbcf6a0479b21b1d3a4af3893f63207fe7",
  "0x3d4f0513e8a29669b960f9dbca61861548a9a760",
  "0xacba30953f29e21a9b6f2452dc106b539581456c",
  "0x4338665cbb7b2485a8855a139b75d5e34ab0db94",
  "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
  "0x194b302a4b0a79795fb68e2adf1b8c9ec5ff8d1f",
  "0x6cdd08de79231a1957f205a3fe5cf9dbf4b0c454",
  "0x03aa6298f1370642642415edc0db8b957783e8d6",
  "0xd06716e1ff2e492cc5034c2e81805562dd3b45fa",
  "0x12bb890508c125661e03b09ec06e404bc9289040",
  "0x8263cd1601fe73c066bf49cc09841f35348e3be0",
  "0x33d08d8c7a168333a85285a68c0042b39fc3741d",
  "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
  "0x4507cef57c46789ef8d1a19ea45f4216bae2b528",
];

const avalancheaddresses = [
  "0x420fca0121dc28039145009570975747295f2329",
  "0x60781c2586d68229fde47564546784ab3faca982",
  "0xb8d7710f7d8349a506b75dd184f05777c82dad0c",
  "0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd",
  "0x184ff13b3ebcb25be44e860163a5d8391dd568c1",
  "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
  "0x62edc0692bd897d2295872a9ffcac5425011c661",
  "0x2d0afed89a6d6a100273db377dba7a32c739e314",
  "0x69260b9483f9871ca57f81a90d91e2f96c2cd11d",
  "0xaaab9d12a30504559b0c5a9a5977fee4a6081c6b",
  "0x4f94b8aef08c92fefe416af073f1df1e284438ec",
  "0xa25eaf2906fa1a3a13edac9b9657108af7b703e3",
  "0x5947bb275c521040051d82396192181b413227a3",
  "0x62d0a8458ed7719fdaf978fe5929c6d342b0bfce",
  "0x968be3f7bfef0f8edc3c1ad90232ebb0da0867aa",
  "0x63a72806098bd3d9520cc43356dd78afe5d386d9",
  "0xacfb898cff266e53278cc0124fc2c7c94c8cb9a5",
  "0xd1c3f94de7e5b45fa4edbba472491a9f4b166fc4",
  "0xec3492a2508ddf4fdc0cd76f31f340b30d1793e6",
  "0xd5d0a9b3f2c264b955ae7161cfa6d38a7aea60a7",
  "0xa77e70d0af1ac7ff86726740db1bd065c3566937",
  "0x79ea4e536f598dcd67c76ee3829f84ab9e72a558",
  "0x88f89be3e9b1dc1c5f208696fb9cabfcc684bd5f",
  "0x77776ab9495729e0939e9badaf7e7c3312777777",
  "0x093783055f9047c2bff99c4e414501f8a147bc69",
  "0xc654721fbf1f374fd9ffa3385bba2f4932a6af55",
  "0x96e1056a8814de39c8c3cd0176042d6cecd807d7",
  "0x46b9144771cb3195d66e4eda643a7493fadcaf9d",
  "0xb44b645b5058f7e393f3ae6af58a4cef67006196",
  "0x65378b697853568da9ff8eab60c13e1ee9f4a654",
];

const SellTokenList = ({
  setShowSearchBar,
  closeModal,
  setSellToken,
  clearData,
  setbuyToken,
  sellToken,
  buyToken,
  handleSellSelectToken,
}) => {
  const [trendingTokens, setTrendingTokens] = useState([]);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const promises = ethaddresses.map(async (address) => {
          const response = await fetch(
            ` https://api.0x.org/tokens/v1/address/${address}`,
            {
              headers: {
                "0x-api-key": "a9e6734f-cd87-44c8-a4b5-a1c75945ae29",
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          return result.data[0]; // Assuming the API returns "data"
        });

        const tokens = await Promise.all(promises);
        console.log(tokens)
        setTrendingTokens(tokens);
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchTokenData();
  }, []);

  // Sync selected token with localStorage

  //  const handleSelectToken = (token) => {
  //   if (token.address===buyToken.address){
  //     const tempToken = buyToken;
  //     setbuyToken(token);
  //     setSellToken(tempToken);
  //   }else
  //  { setSellToken(token)
  //   }
  //   console.log(sellToken,buyToken)
  //   setShowSearchBar(false);
  //   clearData();
  //  }
  const handleSelect = (token) =>{
    handleSellSelectToken(token)
    setShowSearchBar(false)
  }
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-4/5 h-[410px] sm:h-[450px] sm:w-[450px] border rounded-3xl sm:py-3 py-2 justify-center overflow-hidden">
        <div className="flex gap-2 pl-[1.25rem] pr-[0.75rem]">
          <div className="border p-2 border-none">
            <CgSearch className="sm:w-5 sm:h-5 w-4 h-4" />
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="search token name or paste address"
              className="w-full py-1 focus:outline-none text-xs sm:text-[15px]"
            />
          </div>
          <div
            className="border p-2 border-none"
            onClick={() => setShowSearchBar(false)}
          >
            <IoMdClose className="sm:w-5 sm:h-5 w-4 h-4 cursor-pointer" />
          </div>
        </div>

        {/* Line section */}
        <div className="relative w-full h-[1px] sm:mt-2 mt-1 bg-[#f1f2f4]"></div>

        {/* platforms */}
        <div className="flex gap-3 pl-[1.25rem] pr-[0.75rem] mt-2">
          <div>
            <button className="sm:text-sm text-xs font-[500] bg-[#f1f2f4] text-black py-2 px-[.45rem] w-10 rounded-[.55rem]">
              All
            </button>
          </div>
          {options.map((opt)=>
          <div className=" bg-[#f1f2f4] text-black px-2 my-0.5 rounded-[.55rem] items-center justify-center flex ">
          
            <img
              src={opt.image}
              alt=""
              className="sm:w-5 sm:h-5 w-3 h-3 items-center "
            />
          </div>
          )}
          <div className="flex gap-1 bg-[#f1f2f4] text-black py-[.35rem] rounded-[.55rem]  px-[.45rem]">
            <p className="sm:text-sm text-xs font-[500] ">More</p>
            <IoIosArrowDown className="text-xs mt-1" />
          </div>
        </div>

        <div className="relative w-full h-[1px] sm:mt-3 mt-2 bg-[#f1f2f4]"></div>

        {/* ========================== */}
        <div className="token-list overflow-y-auto p-4">
          <div className="pl-4 pr-3">
            <p className="sm:text-sm text-xs text-inactiveHead font-semibold mt-4 sm:-mt-1">
              Most Popular
            </p>
            <div className="flex mt-2 sm:gap-3 gap-3 flex-wrap">
              {MAINNET_TOKENS.map((token, i) => (
                <button
                  key={i}
                  className="flex bg-[#f1f2f4] text-black text-[11px] font-[500] sm:py-[.35rem] rounded-[1.625rem] sm:px-[.45rem] py-[3px] px-[5px]"
                  onClick={() => handleSelect(token)
                  } // Use the updated function
                >
                  <img
                    src={token.logo}
                    alt={token.name}
                    className="sm:w-[18px] sm:h-[18px] w-4 h-4 rounded-full"
                  />
                  <span className="text-black sm:text-xs text-xs ml-1">
                    {token.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="sm:mt-1 pt-3">
            <p className="sm:text-sm text-xs text-inactiveHead font-semibold pl-4 pr-3">
              Trending
            </p>
            <div className="h-60 pl-4 pr-3 pb-1">
              {trendingTokens.map((token, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(token)} // Use the updated function
                  className="flex justify-between sm:mt-5 mt-4 cursor-pointer"
                >
                  <div className="flex gap-2">
                    <img
                      src={token.logo}
                      alt={token.name}
                      className="w-[30px] h-[30px] p-[0.375rem] bg-gray-100 rounded-full"
                    />
                    <div className="flex flex-col ml-2">
                      <span className="text-xs font-[500]">{token.name}</span>
                      <span className="text-xs text-gray-500 font-[500]">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-inactiveHead">
                      {token.chainName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellTokenList;
