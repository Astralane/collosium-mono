package main

import (
	"context"
	"time"

	"github.com/urfave/cli/v2"
	"k8s.io/klog/v2"
)

func newCmd_VerifyIndex_sig2cid() *cli.Command {
	return &cli.Command{
		Name:        "sig-to-cid",
		Description: "Verify the index of the CAR file that maps transaction signatures to CIDs.",
		ArgsUsage:   "<car-path> <index-file-path>",
		Before: func(c *cli.Context) error {
			return nil
		},
		Flags: []cli.Flag{},
		Action: func(c *cli.Context) error {
			carPath := c.Args().Get(0)
			indexFilePath := c.Args().Get(1)
			{
				startedAt := time.Now()
				defer func() {
					klog.Infof("Finished in %s", time.Since(startedAt))
				}()
				klog.Infof("Verifying Sig-to-CID index for %s", carPath)
				err := VerifyIndex_sig2cid(context.TODO(), carPath, indexFilePath)
				if err != nil {
					return err
				}
				klog.Info("Index verified successfully")
			}
			return nil
		},
	}
}
