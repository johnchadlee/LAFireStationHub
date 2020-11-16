# Fire Station Hub

**Fire Station Hub &amp; Daily Duty Report** *CSCI 401*

## Team

* Austin Traver
* Jackie Fan
* John Lee
* Samuel He

---

# Walkthrough

> All the necessary commands, in order, attached below. These were the commands
> I used, start to finish, while creating this web app.
>
> -- Austin

The goal of the steps below is for a day you may ever need to recreate this
application. If that day ever comes, you'll only need to type a few commands
from your command line, and you'll (hopefully) be back in business.

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

* List the available subscriptions

    ```shell script
    az account list -o table
    ```

* Set any
[default subscription](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create-optional-parameters)
as the default, no charges will be incurred.

    ```shell script
    az account set --subscription 'fshsubscription'
    ```

* Configure the default location, the closest being `westus`

    ```shell script
    az configure --defaults location='westus'
    ```

* [Create a resource group](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create)

    ```shell script
    az group create --name 'fshgroup'
    ```

* Set the default resource group to used by the `az` CLI

    ```shell script
    az configure --defaults group='fshgroup'
    ```

* [Create an application service plan](https://docs.microsoft.com/en-us/cli/azure/appservice/plan?view=azure-cli-latest#az_appservice_plan_create)

    ```shell script
    az appservice plan create --name 'fshappservice' --sku 'FREE'
    ```

* Create a web application, adding it to the application service plan we created
  in the previous step

    ```shell script
    az webapp create --name 'fshwebapp' --plan 'fshappservice'
    ```

* Set the default web application to be used by the `az` CLI

    ```shell script
    az configure --defaults web='fshwebapp'
    ```

* Create a storage account

    ```shell script
    az storage account create --name 'fshstorage' --sku 'Standard_LRS' --kind 'StorageV2'
    ```

* Create a storage container

    ```shell script
    az storage container create --name 'fshcontainer' --account-name 'fshstorage' --auth-mode login
    ```

* Grant owner-level permissions to a user within this resource group

    ```shell script
    az role assignment create --role 'Storage Blob Data Owner' --assignee 'austin.traver@fire.lacounty.gov' --resource-group 'fshgroup'
    ```

* Upload all files in the current directory into Azure Blob Storage

    ```shell script
    az storage blob upload-batch --source ${PWD} --destination 'fshcontainer' --account-name 'fshstorage' --auth-mode 'login'
    ```

* Create a cognitive search service

    ```shell script
    az search service create --name 'fshsearchbot' --sku 'basic'
    ```

Anything related to cognitive search can't be done on a command-line from here
on out. I've written a guide, attached below.

---

Follow Microsoft's article to
[create an Azure Cognitive Search index](https://docs.microsoft.com/en-us/azure/search/search-get-started-portal)

If you experience issues, it might be worth taking the time to configure Windows
Subsystem for Linux. The Microsoft's documentation will help you
[get started with Windows Subsystem for Linux](https://docs.microsoft.com/en-us/learn/modules/get-started-with-windows-subsystem-for-linux/)

If the Windows Store is blocked, you may need to
[Manually download Windows Subsystem for Linux distro packages](https://docs.microsoft.com/en-us/windows/wsl/install-manual),
the steps from the article have been included below

1. Download Ubuntu from the command prompt

    ```powershell
    Invoke-WebRequest -Uri https://aka.ms/wslubuntu2004 -OutFile Ubuntu.appx -UseBasicParsing
    ```

1. Install your distro with PowerShell. Simply navigate to folder containing the
   distro downloaded from above `Ubuntu.appx`, and in that directory run the
   following command:

    ```powershell
    Add-AppxPackage .\Ubuntu.appx
    ```

1. Set up [version control in Visual Studio Code](https://code.visualstudio.com/docs/editor/versioncontrol)

1. [Create a service principal](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=userlevel#generate-deployment-credentials)
   to authenticate with Azure App Services for GitHub Actions

    ```shell script
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

---

# Syncing files with the cloud

As far as costs incurred, we have about 66 GB stored at $0.02/GB/mo, (totaling
$1.32/mo) with a one-time fixed cost of 95,000 write operations to the Azure
Blob Storage Container, which is priced at a total of $0.52 altogether

These figures are from the [Azure blob storage pricing table](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/) so expect a
(small) discrepancy between the numbers reported here and what ends up appearing
on the monthly invoice/statement from Azure.

I managed to get us a coupon to get the first $200 of cloud infrastructure free
though, and I believe it applies to the Cognitive Search service as well. The
cognitive search service is using the "Basic" tier, which costs ~$70/month.
Without upgrading to the "Basic" tier, the Cognitive Search index would be
pretty limited. The "Free" tier only supports indexing 20 documents total. The
number of files that need to be searchable from within the fire station is much
greater, so the "Free" plan doesn't seem like a viable solution.

The documentation on [the azcopy repo](https://github.com/Azure/azure-storage-azcopy) states that using the "sync" subcommand
instead of [the "copy" subcommand](https://docs.microsoft.com/en-us/azure/storage/common/storage-ref-azcopy-copy) will ignore unchanged files. In other
words, if it sees that a file has not been modified since the last sync to the
cloud, `azcopy` will not **re**sync the file, it will simply move on to the next
file, and so on.

Generally, you'll just be
[using the `azcopy.exe` file](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10)
to [transfer data with AzCopy to Blob storage](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-blobs)

I've found a command to
[synchronize the Azure Blob Storage container](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-blobs#update-a-container-with-changes-to-a-local-file-system)
with changes made to the local file system, and have provided it below


    ```shell script
        az search service create \
        -n 'FireStationSearch'
        --sku 'Free'
    ```


---


## Setting up a cognitive search index

First, Use
[Azure's import data wizard](https://docs.microsoft.com/en-us/azure/search/search-get-started-portal)
to create a search index for the PDF files, the ones uploaded to blob storage in
the previous step above

Included below are the fields that I changed. As a matter of convention, I
provided all resources related to this fire station hub with names that had
"fsh" prefixed to them.

### Section 1: Connect to your data

* Data source name: `fshdatasource`
* Connection string:
* "Choose an existing connection" (fshstorage > fshcontainer)
* [ ] "Authenticate using managed identity"
* Container name: fshcontainer
* Blob folder: <empty>
* Description: <empty>

### Section 2: Add cognitive skills (optional)

* Add enrichments
* Skillset name: `fshskillset`
* [x] Enable OCR and merge all text into merged_content field
* Save enrichments to a knowledge store
* Storage account connection string
  *   *Choose an existing connection* (`fshstorage` > `fshcontainer`)
* Azure blob projections
* [x] Document
* Container name: `fshcontainer`

### Section 3: Customize target index

* Index name: `fshindex`

### Section 4: Create an indexer

* Name: `fshindexer`
* Schedule: `daily`

### Final Steps

Click `Submit`

🎉 Congratulations! You're done! 🎉

---

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

