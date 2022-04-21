import React from "react";
import SlotMachine from "react-slot-machine-gen";
import Slots from "../assets/slots.jpg";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { Box } from "@mui/material";
import {
  useGetJackpotAmount,
  useVendorContractMethod,
} from "../hooks/useVendor";
import { useTokenBalance } from "../hooks/useToken";
import { ethers } from "ethers";

function SlotContainer() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account) ?? 0;
  const tokenBalance = useTokenBalance(account) ?? 0;
  const jackpotAmount = useGetJackpotAmount();
  const [play, setPlay] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const { state: buyTokenStatus, send: buyToken } =
    useVendorContractMethod("buyTokens");

  const icons: string[] = [
    "bell",
    "cash",
    "orange",
    "lemon",
    "grapes",
    "cherries",
    "7",
    "bar",
  ];

  // hardcoded height of slot image
  const height = 989;
  const total = icons.length;
  const individualHeight = height / total;
  const centerOffset = individualHeight / 2;
  const symbols: any[] = [];
  for (let i = 0; i < total; i++) {
    symbols.push({
      title: icons[i],
      position: centerOffset + individualHeight * i,
      weight: 1,
    });
  }
  const reels = [
    {
      imageSrc: Slots,
      symbols,
    },
    {
      imageSrc: Slots,
      symbols,
    },
    {
      imageSrc: Slots,
      symbols,
    },
  ];

  const handleResult = (results) => {
    setSpinning(false);
    const isWin = new Set(results).size === 1;
    if (isWin) {
      // TODO: handle winning logic
    }
  };

  const handlePlay = () => {
    setSpinning(true);
    setPlay(!play);
  };

  const actionButton = account ? (
    <div className="container--actions">
      <Button
        variant="contained"
        color="primary"
        onClick={() => buyToken({ value: ethers.utils.parseEther(".01") })}
      >
        Buy 1 Token
      </Button>
      <Button
        className="button--slots"
        variant="contained"
        disabled={spinning}
        onClick={() => handlePlay()}
      >
        Play
      </Button>
      <Button
        className="button--deactivate"
        variant="contained"
        color="error"
        onClick={() => deactivate()}
      >
        Disconnect
      </Button>
    </div>
  ) : (
    <div className="container--connect">
      <Button
        onClick={() => activateBrowserWallet()}
        variant="contained"
        color="info"
      >
        Connect Wallet
      </Button>
    </div>
  );
  return (
    <>
      <Box>
        <Typography variant="h4" component="h1">
          WIN {formatEther(jackpotAmount?._hex ?? 0)} ETH
        </Typography>
      </Box>
      <div className="container--slots">
        <Card className="card" sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              {account ? "Account balance" : "Welcome!"}
            </Typography>
            <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
              {account &&
                `${parseFloat(etherBalance.toString()).toFixed(4)} ETH`}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              {account ? "Tokens" : ""}
            </Typography>
            <Typography variant="h5" component="div">
              {account && tokenBalance}
            </Typography>
          </CardContent>
          <CardActions>{actionButton}</CardActions>
        </Card>
        <SlotMachine
          reels={reels}
          play={play}
          options={{ reelHeight: height, reelWidth: 102, reelOffset: 0 }}
          callback={(e) => handleResult(e)}
        />
      </div>
    </>
  );
}

export default SlotContainer;
