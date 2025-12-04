## Installation

```sh
brew tap mobile-dev-inc/tap
brew install maestro
# Seems like there is some bugs with the last version so I recommend to downgrade
brew tap-new $USER/maestro-downgrade
brew extract --version=1.40.0 mobile-dev-inc/tap/maestro $USER/maestro-downgrade
brew install $USER/maestro-downgrade/maestro@1.40.0
brew link --overwrite --force maestro@1.40.0
```

## Run emulator

```sh
maestro start-device --platform=android
# Or
maestro start-device --platform=ios
```

## Create a flow file

A maestro folder has been created, you can create a flow file in it to run a test

[See file structure](https://docs.maestro.dev/getting-started/writing-your-first-flow)

[See commands](https://docs.maestro.dev/api-reference/commands)

## Run a test

```sh
maestro test src/maestro/android-create-reminder-flow.yaml
```