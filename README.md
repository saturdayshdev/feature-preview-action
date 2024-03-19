### Feature Preview Action

GitHub Action for previewing features in staging environments. This action will take care of creating DNS records, building images and deploying to Portainer.

### Usage

To use this action, simply create a workflow in `.github/workflows` and use it:

```yaml
name: Feature Preview

on:
  pull_request:
    types: [opened, closed]

env:
  IMAGE_BASE: ${{ github.event.repository.name }}
  IMAGE_PATH: docker/feature-preview

jobs:
  feature-preview:
    name: Feature Preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: saturdayshdev/feature-preview-action@v2.2.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pr-head-ref: ${{ github.event.pull_request.head.ref }}
          pr-status: ${{ github.event.action }}
          image-path: ${{ env.IMAGE_PATH }}
          image-base: ${{ env.IMAGE_BASE }}
          cloudflare-email: ${{ secrets.CLOUDFLARE_EMAIL }}
          cloudflare-api-key: ${{ secrets.CLOUDFLARE_API_KEY }}
          cloudflare-domain: saturdays.live
          cloudflare-target: ${{ secrets.CLOUDFLARE_TARGET }}
          portainer-url: ${{ secrets.PORTAINER_URL }}
          portainer-username: ${{ secrets.PORTAINER_USERNAME }}
          portainer-password: ${{ secrets.PORTAINER_PASSWORD }}
          portainer-endpoint-id: ${{ vars.PORTAINER_ENDPOINT }}
          env-file: ${{ vars.ENVFILE }}
          stack-compose-path: ${{ env.IMAGE_PATH }}/docker-compose.yml
```

### Media

<img width="926" alt="image" src="https://github.com/saturdayshdev/feature-preview-action/assets/17478199/2eebe002-2a45-43f3-b50a-f91ea4a11225">
