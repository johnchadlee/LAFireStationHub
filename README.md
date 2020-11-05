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

1. List the available subscriptions

    ```shell script
    az account list -o table
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
. For instance, `FireStationGroup`. Set it to be the default resource group

    ```shell script
    az group create -n 'FireStationGroup'
    az configure --defaults group='FireStationGroup'
    ```

1. [Create an application service plan](https://docs.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az_appservice_plan_create)
. For instance, `FireStationServicePlan`.

    ```shell script
    az appservice plan create --name 'FireStationServicePlan' --sku 'FREE'
    ```

1. Create a web application. For instance, `FireStationWebApp`. Add it within the application service plan. For instance, `FireStationServicePlan`

    ```shell script
    az webapp create --name 'FireStationWebApp' --plan 'FireStationServicePlan'
    ```

1. Set the default web app. For instance, `FireStationWebApp`

    ```shell script
    az configure --defaults web='FireStationWebApp'
    ```

1. Follow the steps to configure Windows sub-system for Linux from the learning module in Microsoft's documentation titled [Get started with the Windows Subsystem for Linux](https://docs.microsoft.com/en-us/learn/modules/get-started-with-windows-subsystem-for-linux/)

1. If the Windows Store is blocked, you may need to [Manually download Windows Subsystem for Linux distro packages](https://docs.microsoft.com/en-us/windows/wsl/install-manual), the steps from the article have been included below

1. Set up [Version control in Visual Studio Code](https://code.visualstudio.com/docs/editor/versioncontrol)

1. Download Ubuntu from the command prompt

    ```powershell
    Invoke-WebRequest -Uri https://aka.ms/wslubuntu2004 -OutFile Ubuntu.appx -UseBasicParsing
    ```

1. Install your distro with PowerShell. Simply navigate to folder containing the distro downloaded from above `Ubuntu.appx`, and in that directory run the following command

    ```powershell
    Add-AppxPackage .\Ubuntu.appx
    ```

1. [Create a service principal](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=userlevel#generate-deployment-credentials)  to authenticate with Azure App Services for GitHub Actions

    ```sh
    subscription_name='Fire'
    resource_group='firestationhub'
    webapp='firestationhub'
    subscription=$(az account list --output table | grep ${subscription_name} | awk '{print $3}')
    az ad sp create-for-rbac \
        --name 'firestationhub' \
        --role 'contributor' \
        --scopes /subscriptions/$subscription/resourceGroups/$resource_group/providers/Microsoft.Web/sites/$webapp \
        --sdk-auth
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

1. Open up the [Microsoft 365 Portal](https://www.office.com) and create a workbook for the Duty Report, optionally using one of Microsoft's three relevant templates:
    1. [Employee shift schedule](https://templates.office.com/en-us/employee-shift-schedule-tm16400192)
    1. [Weekly employee shift schedule](https://templates.office.com/en-us/weekly-employee-shift-schedule-tm03986951)
    1. [Shift work calendar](https://templates.office.com/en-us/shift-work-calendar-tm89105255)
1. [Enable co-authoring in Excel](https://support.microsoft.com/en-us/office/collaborate-on-excel-workbooks-at-the-same-time-with-co-authoring-7152aa8b-b791-414c-a3bb-3024e46fb104#picktab=web)
1. [Share the Excel workbook with others](https://support.microsoft.com/en-us/office/share-your-excel-workbook-with-others-8d8a52bb-03c3-4933-ab6c-330aabf1e589)
1. Select *People you specify can edit* to restrict access and then select *Copy link*
1. In `./index.html`, replace the `href` attribute of the `<a>` tag with title `Daily Duty Coverage` with the link you copied to your clipboard in the previous step


## Useful Resources

* [Continuous delivery by using GitHub Action](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-github-actions?tabs=dotnet)
* [Creating a website in a single `az` command](https://docs.microsoft.com/en-us/azure/app-service/quickstart-html#create-a-web-app)
* [Quickstart: Building your first static web app using the Azure CLI](https://docs.microsoft.com/en-us/azure/static-web-apps/get-started-cli?tabs=vanilla-javascript)
* [Visual Studio Code's plugin for Azure Static Web Apps](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)

## The road ahead

* [Upload the PDF files to Azure blob storage](https://docs.microsoft.com/en-us/cli/azure/storage/blob?view=azure-cli-latest#az_storage_blob_upload_batch)
* [Configure encrypted secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)
* [Configure build with GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions)
* [Configure your App Service or Azure Functions app to use Azure AD login](https://docs.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad#advanced) or some other form of [Azure App Service access restrictions](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions)


---

# Walkthrough

> A ll the necessary commands, in order, attached below. These were the commands
> I used, start to finish, to create this web app
> -- Austin


# Log into Azure account

```shell script
az login
```

# Set any subscription as the default, no charges will be incurred

```txt

az account set --subscription 'fshsubscription'

# Configure the default location
az configure --defaults location='westus'

# Create a resource group
az group create --name 'fshgroup'
az configure --defaults group='fshgroup'

# Create an application service plan
az appservice plan create --name 'fshappservice' --sku 'FREE'

# Create a web application
az webapp create --name 'fshwebapp' --plan 'fshappservice'
az configure --defaults web='fshwebapp'

# Create a storage account
az storage account create --name 'fshstorage' --sku 'Standard_LRS' --kind 'StorageV2'

# Create a storage container
az storage container create --name 'fshcontainer' --account-name 'fshstorage' --auth-mode login

# Grant owner-level permissions to a user within this resource group
az role assignment create --role 'Storage Blob Data Owner' --assignee 'austin.traver@fire.lacounty.gov' --resource-group 'fshgroup'

# Upload all files in the current directory into Azure Blob Storage
az storage blob upload-batch --source ${PWD} --destination 'fshcontainer' --account-name 'fshstorage' --auth-mode 'login'

# Create a cognitive search service
az search service create --name 'fshsearch' --sku 'free'

# Get the primary admin key for the Cognitive Search service
az search admin-key show --service-name 'fshsearch'

# https://docs.microsoft.com/en-us/azure/search/search-get-started-portal
# Use Azure's "import data wizard" to create a search index
# for the PDF files uploaded to blob storage
# These were the commands I used, start to finish, to create this web app
# - Austin Traver

# -----------------------------

# [Connect to your data]
# ======================
# Data source name: fshdatasource
# Connection string:
#   -> "Choose an existing connection" (fshstorage > fshcontainer)
# [ ] "Authenticate using managed identity"
# Container name: fshcontainer
# Blob folder: <empty>
# Description: <empty>

# -----------------------------

# [Add cognitive skills (optional)]
# =================================
# Add enrichments
# Skillset name: fshskillset
# [x] Enable OCR and merge all text into merged_content field
# Save enrichments to a knowledge store
# Storage account connection string
#   -> "Choose an existing connection" (fshstorage > fshcontainer)
# Azure blob projections
# [x] Document
# Container name: fshcontainer

# -----------------------------

# [Customize target index]
# ========================
# Index name: fshindex

# -----------------------------

# [Create an indexer]
# ===================
# Name: fshindexer
# Schedule: daily

# -----------------------------

# 🎉 Submit 🎉


# ...

# JavaScript SDK Quickstart
# https://docs.microsoft.com/en-us/azure/search/search-get-started-javascript
# npm install @azure/search-documents
# npm install dotenv

# From the Azure web portal:
# -> Dashboard -> Search service -> fshsearch -> Settings > Keys
# (copy the "Primary admin key")
# edit .env and change the value of SEARCH_API_KEY
# e.g. SEARCH_API_KEY=7A27B85012A2A27B3665541D52E179FF

```

---
