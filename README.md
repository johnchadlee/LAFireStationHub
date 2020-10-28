# Fire Station Hub

**Fire Station Hub &amp; Daily Situation Report**
*CSCI 401*

## Team

* Austin Traver
* Jackie Fan
* John Lee
* Samuel He

---

## Recreating this app from the command line

1. Install `az`, [the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

    * **Windows**: Start PowerShell as an administrator, and run the following command:

        ```txt
        Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi
        ```

    * **macOS**: Open Terminal, and run the following command:

        ```shell script
        brew update && brew install azure-cli
        ```

1. Log into `az`

    ```shell script
    az login
    ```

1. Set the [default subscription](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create-optional-parameters)

    ```shell script
    az account set -s 'SUBSCRIPTION_ID'
    ```

1. Set the default location to `westus`

    ```shell script
    az configure --defaults location='westus'
    ```

1. [Create a resource group](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create)
(`FireStationGroup` in this example) and set it as the default

    ```shell script
    az group create -n 'FireStationGroup'
    az configure --defaults group='FireStationGroup'
    ```

1. [Create an application service plan](https://docs.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az_appservice_plan_create)
(`FireStationServicePlan` in this example)

    ```shell script
    az appservice plan create --name 'FireStationServicePlan' --sku 'FREE'
    ```

1. Create a web application `FireStationWebApp` within the application service plan `FireStationServicePlan`

    ```shell script
    az webapp create --name 'FireStationWebApp' --plan 'FireStationServicePlan'
    ```

1. Set `FireStationWebApp` as the default web application

    ```shell script
    az configure --defaults web='FireStationWebApp'
    ```

1. Configure continuous deployment from the GitHub repository `lacofd/firestationhub`

    ```shell script
    az webapp deployment source config \
        --repo-url 'https://github.com/lacofd/firestationhub' \
        --branch 'master' \
        --git-token ${GITHUB_TOKEN}
    ```

1. Create a Cognitive Search service `FireStationSearch`

    ```shell script
        az search service create \
        -n 'FireStationSearch'
        --sku 'Free'
    ```

1. Follow Microsoft's article to [create an Azure Cognitive Search index](https://docs.microsoft.com/en-us/azure/search/search-get-started-portal)

## Daily Duty Report

To embed an Excel workbook, replicate the following procedure

1. Upload a new or existing Excel workbook to the [Microsoft 365 Portal](https://www.office.com) and select the workbook
1. [Enable co-authoring in Excel](https://support.microsoft.com/en-us/office/collaborate-on-excel-workbooks-at-the-same-time-with-co-authoring-7152aa8b-b791-414c-a3bb-3024e46fb104#PickTab=Web)
1. [Share the Excel workbook with others](https://support.microsoft.com/en-us/office/share-your-excel-workbook-with-others-8d8a52bb-03c3-4933-ab6c-330aabf1e589)
1. Select *People you specify can edit* to restrict access and then select *Copy link*
1. In `./index.html`, replace the `href` attribute of the `<a>` tag with title `Daily Duty Coverage` with the link you copied to your clipboard in the previous step

