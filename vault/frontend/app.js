const connectButton = document.getElementById('connectButton');
const walletInfo = document.getElementById('walletInfo');

let provider;

const connectWallet = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            walletInfo.innerHTML = `Connected: ${address}`;
            connectButton.innerHTML = 'Disconnect';
            connectButton.removeEventListener('click', connectWallet)
            connectButton.addEventListener('click', disconnectWallet)
        } catch (error) {
            console.error(error);
            walletInfo.innerHTML = 'Failed to connect to wallet.';
        }
    } else {
        walletInfo.innerHTML = 'Metamask not found.';
    }
};

const disconnectWallet = () => {
    provider = null;
    walletInfo.innerHTML = '';
    connectButton.innerHTML = 'Connect Wallet';
    connectButton.removeEventListener('click', disconnectWallet)
    connectButton.addEventListener('click', connectWallet)
}

connectButton.addEventListener('click', connectWallet);

window.addEventListener('load', () => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        });
    }
});