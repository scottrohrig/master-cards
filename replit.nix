{ pkgs }: {
	deps = [
		pkgs.lazygit
  pkgs.htop
  pkgs.nodejs-16_x
		pkgs.nodePackages.typescript-language-server
		pkgs.yarn
		pkgs.replitPackages.jest
	];
}