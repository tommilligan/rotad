<p align="center">
  <img src="./img/rotad_logo_128.png" width="128px" height="128px">
  
  <h3 align="center">rotad</h3>

  <p align="center">
    Sync your NHS shift rota to Google Calendar.
  </p>
</p>

## Usage

**Note:** Your Google account must be whitelisted before login. Please contact me directly to get access.

Check out the hosted version [here](https://tommilligan.github.io/rotad/).

Login is provided by the Google account you wish to sync your rota to.

### Supported format

Currently supported rota format is one day per line.

This is designed to be copied from an excel column.

```
O
O
D


L
L
...
```

The supported values are:

| Code           | Title                 | Start (local) | End (local)      |
| -------------- | --------------------- | ------------- | ---------------- |
| `D`            | Day                   | 08:00         | 17:00            |
| `L`            | Long                  | 09:00         | 21:15            |
| `LT`           | Late                  | 14:00         | 22:00            |
| `N`            | Night                 | 21:00         | 09:30 (next day) |
| `STD`          | Self Development Time | 10:00         | 16:00            |
| `O`, `<empty>` | Off                   | (no shift)    | (no shift)       |

## Roadmap

- [ ] Custom time/parsing options for each rota code

## Gallery

Upload in action

<img src="./img/rotad_upload.png" width="600px" height="420px">

The beautiful result

<img src="./img/rotad_gcal.png" width="600px" height="400px">
